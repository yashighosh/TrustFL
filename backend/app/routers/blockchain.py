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
            "timestamp": v.verification_timestamp
        })
    return results
