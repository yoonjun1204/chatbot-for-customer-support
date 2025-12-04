import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date

from database import Base, engine, get_db, SessionLocal
from models import Conversation, Message, User, Order
from nlp import handle_intent, get_quick_replies
from rasa_client import parse_message

from sqlalchemy.orm import Session


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Customer Support Chatbot API")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
# CORS so React frontend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    conversation_id: int
    reply: str
    intent: str
    entities: Dict[str, Any]
    quick_replies: List[str]
    payload: Dict[str, Any]

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    role: str


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db)):
    # 1. Find or create conversation
    if req.conversation_id:
        conv = db.query(Conversation).filter(Conversation.id == req.conversation_id).first()
    else:
        conv = None

    if not conv:
        # New conversation: use provided user_id or anonymous
        conv = Conversation(user_id=req.user_id or "anonymous", created_at=datetime.utcnow())
        db.add(conv)
        db.commit()
        db.refresh(conv)
    else:
        # Existing conversation: if user has just logged in, update user_id
        if req.user_id and conv.user_id != req.user_id:
            conv.user_id = req.user_id

    conv.updated_at = datetime.utcnow()
    db.add(conv)

    # 2. Store user message
    user_msg = Message(
        conversation_id=conv.id,
        sender="user",
        text=req.message,
        created_at=datetime.utcnow(),
    )
    db.add(user_msg)

    # 3. NLP: call Rasa to get intent + entities
    intent, entities = parse_message(req.message)

    # 🔐 Add auth info for intent handler
    # Here I'm assuming user_id is stored as email or user primary key string.
    # Frontend should only send this when user is logged in.
    entities = entities or {}
    entities["user_identifier"] = conv.user_id  # e.g. "alice@example.com" or "anonymous"

    # 4. Handle intent with backend logic (hybrid)
    reply_text, payload = handle_intent(intent, entities, db=db)

    # 5. Store bot message
    bot_msg = Message(
        conversation_id=conv.id,
        sender="bot",
        text=reply_text,
        created_at=datetime.utcnow(),
    )
    db.add(bot_msg)

    db.commit()

    # 6. Quick replies
    quick_replies = get_quick_replies(intent)

    return ChatResponse(
        conversation_id=conv.id,
        reply=reply_text,
        intent=intent,
        entities=entities,
        quick_replies=quick_replies,
        payload=payload,
    )

@app.get("/api/conversations/{conversation_id}/messages")
def get_conversation_messages(conversation_id: int, db: Session = Depends(get_db)):
    msgs = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    return [
        {
            "id": m.id,
            "sender": m.sender,
            "text": m.text,
            "created_at": m.created_at.isoformat(),
        }
        for m in msgs
    ]

@app.post("/api/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # 1. Find user by email
    user = db.query(User).filter(User.email == req.email).first()

    # 2. Basic password check (plaintext for demo/FYP)
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 3. Return basic profile + role
    return LoginResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role or "customer",
    )

