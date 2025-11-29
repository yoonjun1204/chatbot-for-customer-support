// frontend/src/App.tsx
import React, { useState, useEffect, FormEvent } from "react";

type Sender = "user" | "bot";

interface ChatMessage {
  id: number;
  sender: Sender;
  text: string;
}

interface ChatApiResponse {
  conversation_id: number;
  reply: string;
  intent: string;
  entities: Record<string, any>;
  quick_replies: string[];
  payload: Record<string, any>;
}

const API_BASE = "http://localhost:8000";

const App: React.FC = () => {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addMessage = (sender: Sender, text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender, text },
    ]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage("user", text);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          user_id: "web-user",
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data: ChatApiResponse = await res.json();
      setConversationId(data.conversation_id);
      addMessage("bot", data.reply);
      setQuickReplies(data.quick_replies || []);
    } catch (err) {
      console.error(err);
      addMessage("bot", "Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  useEffect(() => {
    // Initial greeting from bot
    addMessage("bot", "Hi! 👋 I'm your shirt support chatbot. How can I help you today?");
    setQuickReplies(["Ask about shirts", "Check order status", "Return / exchange policy"]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
        <header className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-lg">Shirt Support Chatbot</h1>
            <p className="text-xs opacity-80">Ask about products, orders, or returns</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-400" title="Online"></div>
        </header>

        <main className="flex-1 flex flex-col p-3 overflow-y-auto space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-200 text-slate-900 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-xl bg-slate-200 text-slate-900 text-sm">
                Typing…
              </div>
            </div>
          )}
        </main>

        {quickReplies.length > 0 && (
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {quickReplies.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(q)}
                className="text-xs border border-blue-500 text-blue-600 rounded-full px-3 py-1 hover:bg-blue-50 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-slate-200 flex gap-2">
          <input
            className="flex-1 border border-slate-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
