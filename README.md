📌 Shirtify – AI Customer Support Chatbot
A full-stack AI support assistant for an e-commerce shirt store.
This project includes:
🧠 Rasa NLU for intent/entity recognition
⚡ FastAPI backend for authentication, chat processing & conversation storage
🎨 React (Vite) frontend with a floating ChatGPT-style chat widget
💾 SQLite database for users, conversations & messages
🔐 User login + saved chat history
💬 ChatGPT-like UI with a history sidebar & context continuation

🚀 Project Structure
chatbot-for-customer-support/
│
├── backend/              # FastAPI backend
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── schemas.py
│   ├── rasa_client.py
│   ├── chatbot.db        # SQLite DB (ignored in Git)
│   ├── .venv/            # Python virtual environment (ignored)
│   └── requirements.txt
│
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── ChatHistoryPanel.tsx
│   │   │   └── AuthPanel.tsx
│   │   └── App.css
│   └── package.json
│
└── rasa_bot/             # Rasa NLU project
    ├── config.yml
    ├── domain.yml
    ├── data/
    ├── actions/
    ├── .venv/            # Rasa virtual env (ignored)
    └── models/

🧠 Features
✔ ChatGPT-style behaviour
Memory inside each conversation
Can continue a previous conversation
Delete conversations
Sidebar history like ChatGPT

✔ Natural language understanding (Rasa)
Understands intents:
Product info
Order status
Returns/exchanges
Small talk (“hello”, “bye”)
Extracts useful entities (order numbers, sizes, colors, etc.)

✔ FastAPI Backend
/auth/login and /auth/register
/api/chat — sends user message → Rasa → stores reply
/conversations — list user chats
/conversations/{id} — delete chat
/conversations/{id}/messages — load history

✔ React Frontend
Floating chat widget
Beautiful modern UI
Quick reply buttons
Sidebar for account & chat history
Works like ChatGPT

⚙️ Installation
1️⃣ Clone the repo
git clone https://github.com/your-username/chatbot-for-customer-support.git
cd chatbot-for-customer-support

🐍 2️⃣ Backend Setup (FastAPI)
Go into backend:
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt


Run backend:
uvicorn main:app --reload


Backend runs at:
http://localhost:8000

🤖 3️⃣ Rasa Setup
cd rasa_bot
python -m venv .venv
.\.venv\Scripts\activate
pip install rasa

Train the model:
rasa train

Run the Rasa server:
rasa run --enable-api --cors="*"

Rasa runs at:
http://localhost:5005

🌐 4️⃣ Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173

🔐 Authentication (Important)
To use chat history, the user must log in.
Use the Auth panel on the left sidebar, or call the API manually:

Register
POST /auth/register
{
  "username": "test",
  "password": "1234"
}

Login
POST /auth/login

Save the returned access_token in localStorage.
The frontend handles this automatically.

💬 Sending a Chat Message

Frontend calls:
POST http://localhost:8000/api/chat
{
  "message": "hello",
  "conversation_id": null
}


Backend:
Creates conversation (if needed)
Sends message to Rasa
Saves user + bot messages in SQLite
Returns bot reply

🗄️ Database Schema
users
| id | username | password_hash |

conversations
| id | user_id | title | created_at |

messages
| id | conversation_id | sender | text | created_at |

🎨 UI Overview
Chat Widget (bottom right)
Smooth animation
Quick replies
Typing indicator
Context-aware replies

Sidebar (bottom left)
Login / Register panel
Chat history with scroll
Click to restore conversation
Delete chat

🧪 Testing
Backend tests
curl -X POST http://localhost:8000/auth/register
curl -X POST http://localhost:8000/api/chat
curl http://localhost:8000/conversations

Rasa tests
rasa shell

📦 Deployment

You may deploy via:
Backend → Render, Railway, EC2
Frontend → Vercel / Netlify
Rasa → local server or VM
SQLite can be swapped for PostgreSQL or MySQL easily.

📄 License
MIT License – free for study & modification.

🙌 Credits
Project created for educational purposes
University of Wollongong – SIM Singapore
CSIT321 / FYP Assistance Chatbot
