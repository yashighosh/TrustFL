import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.medicine import Medicine
from app.models.ml_model import MLModel
from app.models.training_round import TrainingRound
from app.models.model_update import ModelUpdate
from app.models.blockchain import BlockchainVerification
from app.models.contribution import ContributionScore
from app.utils.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Hospital).first():
            print("Database already seeded!")
            return

        print("Seeding Hospitals...")
        h1 = Hospital(hospital_id="H001", hospital_name="CityCare Hospital", hospital_location="Chennai", hospital_type="Private", contact_email="contact@citycare.com", password_hash=get_password_hash("password123"))
        h2 = Hospital(hospital_id="H002", hospital_name="Green Valley Hospital", hospital_location="Bangalore", hospital_type="Private", contact_email="info@greenvalley.com", password_hash=get_password_hash("password123"))
        h3 = Hospital(hospital_id="H003", hospital_name="National Medical Center", hospital_location="Delhi", hospital_type="Government", contact_email="support@nmc.gov.in", password_hash=get_password_hash("password123"))
        db.add_all([h1, h2, h3])
        db.commit()

        print("Seeding Doctors...")
        d1 = Doctor(doctor_id="D001", hospital_id="H001", doctor_name="Dr. Arjun Mehta", specialization="Cardiology", experience_years=10, contact_number="9876543210")
        d2 = Doctor(doctor_id="D002", hospital_id="H001", doctor_name="Dr. Priya Sharma", specialization="Endocrinology", experience_years=8, contact_number="9876543211")
        d3 = Doctor(doctor_id="D003", hospital_id="H002", doctor_name="Dr. Rahul Verma", specialization="General Medicine", experience_years=12, contact_number="9876543212")
        db.add_all([d1, d2, d3])
        db.commit()

        print("Seeding Patients...")
        p1 = Patient(patient_id="P001", hospital_id="H001", patient_name="Rohan Das", gender="Male", blood_group="B+")
        p2 = Patient(patient_id="P002", hospital_id="H001", patient_name="Ananya Sen", gender="Female", blood_group="O+")
        p3 = Patient(patient_id="P003", hospital_id="H002", patient_name="Karan Patel", gender="Male", blood_group="A+")
        p4 = Patient(patient_id="P004", hospital_id="H003", patient_name="Meera Nair", gender="Female", blood_group="AB+")
        db.add_all([p1, p2, p3, p4])
        db.commit()

        print("Seeding Medicines...")
        m1 = Medicine(medicine_id="M001", hospital_id="H001", medicine_name="Amlodipine", category="Antihypertensive", stock=500)
        m2 = Medicine(medicine_id="M002", hospital_id="H001", medicine_name="Metformin", category="Antidiabetic", stock=350)
        m3 = Medicine(medicine_id="M003", hospital_id="H002", medicine_name="Paracetamol", category="Analgesic", stock=1200)
        db.add_all([m1, m2, m3])
        db.commit()

        print("Seeding Federated Learning Data...")
        mod1 = MLModel(model_id="M001", model_name="Heart Disease Predictor", algorithm_type="Neural Network")
        mod2 = MLModel(model_id="M002", model_name="Diabetes Risk Predictor", algorithm_type="Logistic Regression")
        db.add_all([mod1, mod2])
        db.commit()

        tr1 = TrainingRound(round_id="TR001", model_id="M001", round_number=1, status="Completed", global_model_accuracy=0.88, actual_participants=2)
        tr2 = TrainingRound(round_id="TR002", model_id="M001", round_number=2, status="Active", global_model_accuracy=0.91, actual_participants=1)
        db.add_all([tr1, tr2])
        db.commit()

        mu1 = ModelUpdate(update_id="U001", round_id="TR001", hospital_id="H001", model_hash="0xabc123hash", accuracy=0.89, loss_value=0.15)
        mu2 = ModelUpdate(update_id="U002", round_id="TR001", hospital_id="H002", model_hash="0xdef456hash", accuracy=0.87, loss_value=0.18)
        mu3 = ModelUpdate(update_id="U003", round_id="TR002", hospital_id="H003", model_hash="0xxyz789hash", accuracy=0.91, loss_value=0.12)
        db.add_all([mu1, mu2, mu3])
        db.commit()

        bv1 = BlockchainVerification(verification_id="B001", update_id="U001", blockchain_transaction_hash="0xabc123hash", block_number=1001, verification_status="Confirmed")
        bv2 = BlockchainVerification(verification_id="B002", update_id="U002", blockchain_transaction_hash="0xdef456hash", block_number=1002, verification_status="Confirmed")
        bv3 = BlockchainVerification(verification_id="B003", update_id="U003", blockchain_transaction_hash="0xxyz789hash", block_number=1003, verification_status="Confirmed")
        db.add_all([bv1, bv2, bv3])
        db.commit()

        cs1 = ContributionScore(contribution_id="C001", hospital_id="H001", round_id="TR001", contribution_value=0.35, reputation_score=0.80)
        cs2 = ContributionScore(contribution_id="C002", hospital_id="H002", round_id="TR001", contribution_value=0.30, reputation_score=0.75)
        cs3 = ContributionScore(contribution_id="C003", hospital_id="H003", round_id="TR002", contribution_value=0.40, reputation_score=0.85)
        db.add_all([cs1, cs2, cs3])
        db.commit()

        print("Database seeded successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
