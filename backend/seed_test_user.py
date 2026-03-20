#!/usr/bin/env python3
"""
Script to seed the database with a test user account.
Run this once to create test credentials for login.
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.user_model import User
from utils.auth_utils import get_password_hash

def seed_test_user():
    """Create a test user in the database"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Test credentials
        test_email = "demo@example.com"
        test_password = "Demo@1234"
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == test_email).first()
        
        if existing_user:
            # Delete old user and recreate with proper hash
            db.delete(existing_user)
            db.commit()
            print(f"♻️ Recreating test user with proper password hash...")
        
        # Create new test user with proper passlib hashing
        hashed_password = get_password_hash(test_password)
        print(f"Password hash created with passlib")
        new_user = User(email=test_email, password_hash=hashed_password)
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("✓ Test user created successfully!")
        print(f"\n📧 Email: {test_email}")
        print(f"🔐 Password: {test_password}")
        print("\nYou can now login with these credentials at: http://localhost:5173")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Error creating test user: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_user()
