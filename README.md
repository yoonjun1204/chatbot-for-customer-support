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

# 🐳 Docker Architecture
- Full environment starts with:
```
docker compose up --build
```

Includes:
- backend	FastAPI (Python 3.11)
- frontend	React (Node 20 + Nginx)
- db	PostgreSQL 16
- rasa	Rasa 3.6

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

# 🔄 Development Workflow
1️⃣ If you update BACKEND code:
```
docker compose build backend
docker compose up
```

If you changed requirements.txt:
```
docker compose build backend --no-cache
```
2️⃣ If you update FRONTEND code:
```
docker compose build frontend
docker compose up
```

If you changed dependencies (package.json):
```
docker compose build frontend --no-cache
```
3️⃣ If you modify RASA training data:

Train the bot:
```
docker compose run --rm rasa train
```

Restart services:
```
docker compose up
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
