from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import get_settings
from app.models.hospital import Hospital
from app.schemas.auth import TokenData

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(id=user_id, role=role)
    except JWTError:
        raise credentials_exception
        
    return token_data


def get_current_hospital(token_data: TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    if token_data.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins do not have a hospital context. Use the admin panel."
        )
        
    hospital = db.query(Hospital).filter(Hospital.hospital_id == token_data.id).first()
    if hospital is None:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return hospital


def get_current_admin(token_data: TokenData = Depends(get_current_user)):
    if token_data.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return token_data
