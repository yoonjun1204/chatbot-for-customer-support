# backend/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read DATABASE_URL from environment.
# In Docker we will set this to PostgreSQL:
#   postgresql+psycopg2://chatbot_user:chatbot_password@db:5432/chatbot_db
# For local dev (no env var), fallback to SQLite.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

# Use SQLite-specific connect_args only when using SQLite
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    # PostgreSQL (or any other DB) – no special connect_args
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
