from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
import uuid
import random
from datetime import datetime
from app.database import get_db
from app.models.training_round import TrainingRound
from app.models.ml_model import MLModel
from app.models.contribution import ContributionScore
from app.models.hospital import Hospital
from app.models.model_update import ModelUpdate
from app.models.blockchain import BlockchainVerification

router = APIRouter(prefix="/api/fl", tags=["Federated Learning"])

class RunRoundRequest(BaseModel):
    model_name: str
    round_number: int
    epochs: int = 5

@router.get("/rounds")
def get_training_rounds(db: Session = Depends(get_db)):
    rounds = db.query(TrainingRound).order_by(TrainingRound.round_number.desc()).limit(10).all()
    results = []
    for r in rounds:
        model = db.query(MLModel).filter(MLModel.model_id == r.model_id).first()
        results.append({
            "round_id": r.round_id,
            "round_number": r.round_number,
            "model_name": model.model_name if model else "Unknown",
            "start_time": r.start_time,
            "end_time": r.end_time,
            "status": r.status,
            "accuracy": r.global_model_accuracy,
            "participants": r.actual_participants
        })
    return results


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    scores = db.query(ContributionScore).order_by(ContributionScore.reputation_score.desc()).all()
    
    # We may have multiple scores per hospital if we record per round.
    # Group by hospital and taking the average/max or just summing updates
    # Actually, let's aggregate for the leaderboard
    hospitals_stats = db.query(
        Hospital.hospital_id,
        Hospital.hospital_name,
        func.avg(ContributionScore.reputation_score).label("avg_reputation"),
        func.count(ContributionScore.contribution_id).label("updates"),
        func.avg(ModelUpdate.accuracy).label("avg_accuracy")
    ).join(ContributionScore, Hospital.hospital_id == ContributionScore.hospital_id)\
     .outerjoin(ModelUpdate, Hospital.hospital_id == ModelUpdate.hospital_id)\
     .group_by(Hospital.hospital_id).all()

    sorted_stats = sorted(hospitals_stats, key=lambda x: x.avg_reputation or 0, reverse=True)

    results = []
    for i, stat in enumerate(sorted_stats):
        results.append({
            "rank": i + 1,
            "hospital_id": stat.hospital_id,
            "hospital_name": stat.hospital_name,
            "reputation_score": float(stat.avg_reputation) if stat.avg_reputation else 0,
            "updates": int(stat.updates) if stat.updates else 0,
            "accuracy": round(float(stat.avg_accuracy) * 100, 1) if stat.avg_accuracy and stat.avg_accuracy <= 1 else (round(float(stat.avg_accuracy), 1) if stat.avg_accuracy else 0)
        })
    return results

@router.post("/run-round")
def run_fl_round(req: RunRoundRequest, db: Session = Depends(get_db)):
    # 1. Get model
    model = db.query(MLModel).filter(MLModel.model_name == req.model_name).first()
    if not model:
        # Fallback to first model
        model = db.query(MLModel).first()
        if not model:
            raise HTTPException(status_code=400, detail="No ML Models found in DB")

    hospitals = db.query(Hospital).limit(3).all()
    if not hospitals:
        raise HTTPException(status_code=400, detail="No hospitals available for training")

    round_id = f"RND-{uuid.uuid4().hex[:6].upper()}"
    
    # Base accuracy calculation based on round number
    base_acc = 60 + min(req.round_number * 2.5, 30)
    
    hosp_metrics = {}
    total_acc = 0
    updates_to_add = []
    blocks_to_add = []
    
    for hosp in hospitals:
        # Simulate local training
        acc = min(base_acc + random.uniform(-3, 3), 99.5)
        loss = max(0.7 - (req.round_number * 0.05) + random.uniform(-0.02, 0.02), 0.05)
        
        update_id = f"UPD-{uuid.uuid4().hex[:6].upper()}"
        model_hash = f"0x{uuid.uuid4().hex}"
        
        update = ModelUpdate(
            update_id=update_id,
            round_id=round_id,
            hospital_id=hosp.hospital_id,
            model_hash=model_hash,
            accuracy=round(acc / 100, 4),
            loss_value=round(loss, 4),
            training_samples=random.randint(500, 1500),
            submission_timestamp=datetime.utcnow()
        )
        updates_to_add.append(update)
        
        # Simulated blockchain verification
        block = BlockchainVerification(
            verification_id=f"BLK-{uuid.uuid4().hex[:6].upper()}",
            update_id=update_id,
            blockchain_transaction_hash=f"tx_{uuid.uuid4().hex}",
            block_number=random.randint(1000, 9999),
            verification_status="Confirmed"
        )
        blocks_to_add.append(block)

        # Contribution score update or create
        cs = db.query(ContributionScore).filter_by(hospital_id=hosp.hospital_id).order_by(ContributionScore.reputation_score.desc()).first()
        prev_rep = float(cs.reputation_score) if cs and cs.reputation_score else 0.5
        new_rep = prev_rep + random.uniform(0.01, 0.05)
        new_cs = ContributionScore(
            contribution_id=f"CS-{uuid.uuid4().hex[:5].upper()}",
            hospital_id=hosp.hospital_id,
            round_id=round_id,
            contribution_value=round(acc / 100 * random.uniform(0.8, 1.0), 3),
            reputation_score=round(new_rep, 3)
        )
        db.add(new_cs)

        hosp_metrics[hosp.hospital_id] = {
            "acc": f"{acc:.1f}%",
            "loss": f"{loss:.4f}",
            "score": f"{new_cs.contribution_value:.2f}",
            "bar": acc
        }
        total_acc += acc

    global_acc = total_acc / len(hospitals)

    new_round = TrainingRound(
        round_id=round_id,
        model_id=model.model_id,
        round_number=req.round_number,
        start_time=datetime.utcnow(),
        end_time=datetime.utcnow(),
        status="Completed",
        global_model_accuracy=round(global_acc / 100, 4),
        actual_participants=len(hospitals)
    )
    
    db.add(new_round)
    db.add_all(updates_to_add)
    db.add_all(blocks_to_add)
    db.commit()

    # Remap hosp_metrics to 'a', 'b', 'c' for UI
    ui_keys = ['a', 'b', 'c']
    ui_metrics = {}
    for i, h in enumerate(hospitals[:3]):
        ui_metrics[ui_keys[i]] = hosp_metrics[h.hospital_id]
        
    return {
        "status": "success",
        "global_acc": f"{global_acc:.1f}",
        "hospital_metrics": ui_metrics
    }
