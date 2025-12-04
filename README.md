# 📦 Customer Support Chatbot (FastAPI + React + Rasa + PostgreSQL)
A full-stack customer support chatbot system built with:

- 🧠 Rasa 3.x (intent classification + entity extraction)
- ⚙️ FastAPI backend (conversation logic + database + hybrid NLP)
- 🌐 React + Vite frontend (chat UI)
- 🗄️ PostgreSQL for storing users, messages & conversations
- 🐳 Docker & Docker Compose for one-command deployment

This project is designed for academic purposes (FYP/CSIT321) but follows real-world architecture and production-grade practices.

# 🚀 Features
🤖 Chatbot Intelligence
- Rasa NLU for intent recognition & entity extraction
- Backend hybrid logic for:
- Order tracking
- Product inquiries
- Returns & policies
- General FAQs

# 🧩 Backend (FastAPI)
- Stores conversations & messages
- Handles intents and replies
- Integrates with Rasa via API
- Provides quick replies
- REST API with OpenAPI docs (/docs)

# 💬 Frontend (React + Vite)
- Clean chat interface
- Typing indicator
- Quick reply buttons
- Conversation state handling
- Backend + Rasa integration

#🗄️ Database (PostgreSQL)
- Users
- Orders
- Conversations
- Messages

# 🐳 Running the Project (One Command)
Make sure Docker Desktop is running.

# 🐳 Docker Architecture
- Full environment starts with:
```
cd chatbot-for-customer-support
docker compose up --build
```

Includes:
- backend	FastAPI (Python 3.11)
- frontend	React (Node 20 + Nginx)
- db	PostgreSQL 16
- rasa	Rasa 3.6

# Seeding Data
```
cd chatbot-for-customer-support
docker exec -it chatbot_backend python seed.py
```
```
📁 Project Structure
chatbot-for-customer-support/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── nlp.py
│   ├── rasa_client.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.js
│
├── rasa_bot/
│   ├── domain.yml
│   ├── nlu.yml
│   ├── rules.yml
│   ├── stories.yml
│   └── models/
│
├── docker-compose.yml
└── README.md
```

# 🐳 Running the Project (One Command)
Make sure Docker Desktop is running.

Then run:
```
docker compose up --build
```

This will:
- Build backend image
- Build frontend image
- Start PostgreSQL
- Start Rasa server
- Serve frontend via Nginx

Access the services:
- Frontend	http://localhost:5173
- FastAPI Docs http://localhost:8000/docs
- Rasa Server http://localhost:5005

# For Developoment:
```
# After changing backend code (Python)
docker compose up -d --build backend

# After changing Rasa bot config (nlu.yml, domain.yml, etc.)
docker exec -it chatbot_rasa rasa train

# Optional: restart Rasa after training
docker compose restart rasa

# After changing frontend (React/CSS)
docker compose up -d --build frontend

# After changing DB schema (models.py) and wanting fresh DB
docker compose down -v
docker compose up --build
# In a second terminal, reseed the database
docker exec -it chatbot_backend python seed.py
```
# Use the full rebuild only when:
- You changed both backend and frontend a lot
- Or you changed something in docker-compose.yml or Dockerfiles
- Or you’re not sure what’s stale
```
docker compose up -d --build
```

# Stop the services:
```
docker compose down or CTRL+C
```

# Database Schema (Simplified)
- Users
- Conversations
- Messages
- Orders


# 🛠️ Technologies Used
- FastAPI
- React + Vite
- Rasa 3.6
- PostgreSQL
- SQLAlchemy
- Docker
- Nginx

# 📚 Future Improvements
- JWT authentication
- Admin dashboard
- Multi-language support
- Vector search for FAQ (OpenAI embeddings)
- Real-time websocket chat

# 👨‍💻 Author
Jun Yoon

CSIT321 / University of Wollongong (SIM)
