from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.training_round import TrainingRound
from app.models.ml_model import MLModel
from app.models.contribution import ContributionScore
from app.models.hospital import Hospital

router = APIRouter(prefix="/api/fl", tags=["Federated Learning"])

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
    scores = db.query(ContributionScore).order_by(ContributionScore.reputation_score.desc()).limit(10).all()
    results = []
    for i, score in enumerate(scores):
        hospital = db.query(Hospital).filter(Hospital.hospital_id == score.hospital_id).first()
        results.append({
            "rank": i + 1,
            "hospital_id": score.hospital_id,
            "hospital_name": hospital.hospital_name if hospital else "Unknown",
            "reputation_score": float(score.reputation_score) if score.reputation_score else 0,
            "contribution_value": float(score.contribution_value) if score.contribution_value else 0
        })
    return results
