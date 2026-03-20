from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import jwt
from typing import Optional

from database import get_db
from models.user_model import User
from utils.auth_utils import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from pydantic import BaseModel, EmailStr
from fastapi import Header

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_user_optional(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Optional authentication - returns None if no valid token provided."""
    if not authorization:
        return None
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except (ValueError, jwt.PyJWTError):
        return None
        
    user = db.query(User).filter(User.email == email).first()
    return user

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Auto-issue token so frontend can log in immediately after signup
    access_token_expires = timedelta(minutes=60 * 24 * 7)  # 7 days
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Debug logging
    print(f"\n🔐 LOGIN ATTEMPT")
    print(f"  Email/Username received: '{form_data.username}'")
    print(f"  Password length: {len(form_data.password)} chars")
    
    # Check if user exists
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user:
        print(f"  ❌ User NOT found in database")
        print(f"  Available users in database:")
        all_users = db.query(User).all()
        for u in all_users:
            print(f"     - {u.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"  ✓ User found: {user.email}")
    print(f"  Stored password hash: {user.password_hash[:50]}...")
    
    # Verify password
    password_match = verify_password(form_data.password, user.password_hash)
    print(f"  Password verification result: {password_match}")
    
    if not password_match:
        print(f"  ❌ Password does NOT match")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"  ✓ Password verified successfully!")
    
    # Create token
    access_token_expires = timedelta(minutes=60 * 24 * 7) # 7 days
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    print(f"  ✓ Token issued: {access_token[:50]}...")
    print(f"✓ LOGIN SUCCESSFUL for {user.email}\n")
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/profile", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
