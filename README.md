# 👕 Shirtify – AI Customer Support Chatbot

A full-stack AI-powered support assistant for an e-commerce shirt website.  
This system behaves similarly to ChatGPT with:

- 🧠 Natural language understanding (Rasa NLU)
- 💬 A modern floating chat widget (React)
- 🔐 Login system + saved chat history (FastAPI backend)
- 🗂 ChatGPT-style left sidebar (Auth + Chat History)
- 💾 SQLite database storing conversations & messages
- 🚀 Seamless backend–frontend integration

---

## 📁 Project Structure
```
chatbot-for-customer-support/
│
├── backend/ # FastAPI backend
│ ├── main.py
│ ├── models.py
│ ├── database.py
│ ├── schemas.py
│ ├── rasa_client.py
│ ├── chatbot.db # SQLite DB (ignored in Git)
│ ├── requirements.txt
│ └── .venv/ # Python virtual environment (ignored)
│
├── frontend/ # React + Vite frontend
│ ├── src/
│ │ ├── App.tsx
│ │ ├── App.css
│ │ └── components/
│ │ ├── ChatWidget.tsx
│ │ ├── ChatHistoryPanel.tsx
│ │ └── AuthPanel.tsx
│ ├── package.json
│ └── vite.config.ts
│
└── rasa_bot/ # Rasa chatbot project
├── config.yml
├── domain.yml
├── data/
├── actions/
├── models/
└── .venv/ # Rasa virtual environment (ignored)
```


---

# 🎯 Features

### 🧠 Rasa AI / NLP
- Understands intents like:
  - Product information  
  - Order status  
  - Return & exchange policy  
  - Greetings / small talk  
- Extracts entities (order number, sizes, colors)

### 💬 ChatGPT-like Web Chat
- Floating chat bubble  
- Typing indicator  
- Quick replies  
- Auto-scrolling  
- Clean modern UI design  

### 🔐 User Accounts
- Login / Register  
- Stores conversations per user  
- Sidebar showing chat history  
- Continue previous conversations  
- Delete conversations  

### 🗄 Database
- SQLite (easy setup, portable)
- Stores:
  - Users  
  - Conversations  
  - Messages  

---

# 🛠 Installation & Setup

---

## 1️⃣ Clone the project

```bash
git clone https://github.com/YOUR_USERNAME/chatbot-for-customer-support.git
cd chatbot-for-customer-support
```

## 2️⃣ Backend Setup (FastAPI)

Navigate to backend:
```
cd backend
py -3.14 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Run backend:
```
uvicorn main:app --reload
```

Backend runs at:
```
http://localhost:8000
```

## 3️⃣ Rasa Setup
```
cd rasa_bot
py -3.10 -m venv .venv
.\.venv\Scripts\activate
pip install rasa
```

Train the Rasa model:
```
rasa train
```

Run Rasa API server:
```
rasa run --enable-api --cors="*"
```

Rasa runs at:
```
http://localhost:5005
```

## 4️⃣ Frontend Setup (React + Vite)
```
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

## Database Schema
```
users
column	        type
id	            int
username	    str
password_hash	str
```
```
conversations
column	        type
id	            int
user_id	        int
title	        str
created_at	    datetime
```
```
messages
column	        type
id	            int
conversation_id	int
sender	        str ("user"/"bot")
text	        str
created_at	    datetime
```

# 🎨 UI Features

Chat Widget

- Floating bottom-right like ChatGPT
- Smooth animations
- Quick reply buttons
- Auto-scroll
- Typing indicator

Sidebar

- Fixed bottom-left
- Login form
- Chat history list
- Delete chat buttons

# Deployment (Optional)

Possible deployment plan:
- Frontend – Vercel / Netlify
- Backend (FastAPI) – Render / Railway / EC2
- Rasa – Self-host VM / EC2
- Database – SQLite → PostgreSQL (for scaling)

# License

MIT License – free to use and modify.

# Credits

Developed for University of Wollongong (SIM)

Final Year Project – AI Customer Support Chatbot
