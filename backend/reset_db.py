#!/usr/bin/env python3
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

# Delete database files first
db_file = "./resume_analyzer.db"
wal_file = "./resume_analyzer.db-wal"
shm_file = "./resume_analyzer.db-shm"

for f in [db_file, wal_file, shm_file]:
    if os.path.exists(f):
        os.remove(f)
        print(f"Deleted {f}")

# Now import and seed
from database import SessionLocal, engine, Base
from models.user_model import User
from utils.auth_utils import get_password_hash

# Create all tables
Base.metadata.create_all(bind=engine)
print("✓ Database tables created")

# Create test user
db = SessionLocal()
test_email = "demo@example.com"
test_password = "Demo@1234"

hashed_password = get_password_hash(test_password)
print(f"✓ Password hashed: {hashed_password[:50]}...")

new_user = User(email=test_email, password_hash=hashed_password)
db.add(new_user)
db.commit()
db.refresh(new_user)
db.close()

print("✓ Test user created successfully!")
print(f"\n📧 Email: {test_email}")
print(f"🔐 Password: {test_password}")
print("\nYou can now login with these credentials!")
