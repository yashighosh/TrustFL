from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.blockchain import BlockchainVerification
from app.models.model_update import ModelUpdate
from app.models.hospital import Hospital

router = APIRouter(prefix="/api/blockchain", tags=["Blockchain"])

@router.get("/ledger")
def get_ledger(db: Session = Depends(get_db)):
    verifications = db.query(BlockchainVerification).order_by(BlockchainVerification.block_number.desc()).limit(20).all()
    results = []
    for v in verifications:
        update = db.query(ModelUpdate).filter(ModelUpdate.update_id == v.update_id).first()
        hospital_name = "Unknown"
        if update:
            hospital = db.query(Hospital).filter(Hospital.hospital_id == update.hospital_id).first()
            if hospital:
                hospital_name = hospital.hospital_name
                
        results.append({
            "verification_id": v.verification_id,
            "update_id": v.update_id,
            "hospital": hospital_name,
            "transaction_hash": v.blockchain_transaction_hash,
            "block_number": v.block_number,
            "status": v.verification_status,
            "timestamp": v.verification_timestamp,
            "accuracy": str(update.accuracy) if update and update.accuracy else None
        })
    return results

import random
import uuid
import hashlib
from app.models.training_round import TrainingRound

@router.post("/mine")
def mine_block(db: Session = Depends(get_db)):
    hospital = db.query(Hospital).first()
    round_model = db.query(TrainingRound).first()
    
    if not hospital or not round_model:
        return {"error": "Ensure at least one hospital and training round exists before mining."}

    update_id = f"U{random.randint(1000, 9999)}"
    acc = round(random.uniform(0.8, 0.98), 2)
    loss = round(random.uniform(0.05, 0.3), 4)
    model_hash = "0x" + hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest()

    new_update = ModelUpdate(
        update_id=update_id,
        round_id=round_model.round_id,
        hospital_id=hospital.hospital_id,
        model_hash=model_hash,
        accuracy=acc,
        loss_value=loss,
        training_samples=random.randint(100, 1000)
    )
    db.add(new_update)
    db.commit()

    verif_id = f"V{random.randint(1000, 9999)}"
    last_block = db.query(BlockchainVerification).order_by(BlockchainVerification.block_number.desc()).first()
    block_num = (last_block.block_number + 1) if last_block else 1

    new_verif = BlockchainVerification(
        verification_id=verif_id,
        update_id=update_id,
        blockchain_transaction_hash=model_hash,
        block_number=block_num,
        verification_status="Pending"
    )
    db.add(new_verif)
    db.commit()
    db.refresh(new_verif)

    return {"message": "Block mined successfully", "status": new_verif.verification_status}

@router.post("/verify")
def verify_chain(db: Session = Depends(get_db)):
    pending_blocks = db.query(BlockchainVerification).filter(BlockchainVerification.verification_status == "Pending").all()
    for block in pending_blocks:
        block.verification_status = "Verified"
    db.commit()
    return {"message": f"{len(pending_blocks)} blocks verified.", "verified_count": len(pending_blocks)}

@router.post("/tamper")
def tamper_chain(db: Session = Depends(get_db)):
    blocks = db.query(BlockchainVerification).all()
    if not blocks:
        return {"error": "No blocks available to tamper."}
    
    target = random.choice(blocks)
    target.blockchain_transaction_hash = "0xTAMPERED_" + str(uuid.uuid4()).replace("-", "")[:24]
    target.verification_status = "Failed"
    db.commit()
    return {"message": f"Block {target.block_number} tampered successfully!"}

