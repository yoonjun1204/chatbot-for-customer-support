# 👕 Shirtify – AI Customer Support Chatbot

A full-stack AI-powered support assistant for an e-commerce shirt website.  
This system behaves similarly to ChatGPT with:

- 🧠 Natural language understanding (Rasa NLU)
- 💬 A modern floating chat widget (React)
- 🔐 Login system (FastAPI backend)
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
│ ├── nlp.py
│ ├── rasa_client.py
│ ├── database.db # SQLite DB (ignored in Git)
│ ├── requirements.txt
│ └── .venv/ # Python virtual environment (ignored)
│
├── frontend/ # React + Vite frontend
│ ├── src/
│ │ ├── App.tsx
│ │ ├── App.css
| | ├── index.css
| | ├── main.tsx
│ │ |── components/
│ │ ├── ChatWidget.tsx
│ ├── package.json
│ └── vite.config.ts
│
└── rasa_bot/ # Rasa chatbot project
├── config.yml
├── endpoints.yml
├── domain.yml
├── credentials.yml
├── data/
│  ├── nlu.yml
│  ├── ruels.yml
│  ├── stories.yml
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
- Login   
- Stores conversations per user   

### 🗄 Database
- SQLite (easy setup, portable)
- Stores:
  - Users  
  - Conversations  
  - Messages
  - Order  

---

# 🛠 Installation & Setup

---

## 1️⃣ Clone the project

```bash
git clone https://github.com/yoonjun1204/chatbot-for-customer-support.git
cd chatbot-for-customer-support
```

## 2️⃣ Backend Setup (FastAPI)

Navigate to backend:
```
cd backend
py -3.14 -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
pip install requests
```
Seed the Data:
```
cd backend
.\.venv\Scripts\activate
python seed.py
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
