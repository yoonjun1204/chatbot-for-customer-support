import React, { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";

type Sender = "user" | "bot";

interface ChatMessage {
  id: number;
  sender: Sender;
  text: string;
}

interface ChatPayload {
  need_order_number?: boolean;
  order?: {
    order_number: string;
    status: string;
    estimated_delivery?: string | null;
  };
  [key: string]: any;
}

interface ChatApiResponse {
  conversation_id: number;
  reply: string;
  intent: string;
  entities: Record<string, any>;
  quick_replies: string[];
  payload: ChatPayload;
}

interface ChatWidgetProps {
  userIdentifier?: string | null; // e.g. customer email
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const ChatWidget: React.FC<ChatWidgetProps> = ({ userIdentifier }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const addMessage = (sender: Sender, text: string) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, sender, text }]);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
          user_id: userIdentifier ?? null, // 👈 pass logged-in user email/id
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
      addMessage(
        "bot",
        "Sorry, something went wrong while talking to the server. Please try again."
      );
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

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage(
        "bot",
        "Hi! 👋 I'm your shirt support chatbot. I can help with product info, order status, and returns."
      );
      setQuickReplies([
        "Ask about shirts",
        "Check order status",
        "Return / exchange policy",
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <button
          className="chat-toggle-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="chat-widget">
          <header className="chat-header">
            <div>
              <div className="chat-title">Shirt Support</div>
              <div className="chat-subtitle">
                {userIdentifier
                  ? `Chatting as ${userIdentifier}`
                  : "Guest · You can still ask about products and orders."}
              </div>
            </div>

            <button
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </header>

          <main className="chat-body">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-message-row ${
                  m.sender === "user" ? "chat-right" : "chat-left"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    m.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message-row chat-left">
                <div className="chat-bubble chat-bubble-bot">Typing…</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </main>

          {quickReplies.length > 0 && (
            <div className="chat-quick-replies">
              {quickReplies.map((q, idx) => (
                <button
                  key={idx}
                  className="chat-quick-reply"
                  onClick={() => handleQuickReply(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              className="chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="chat-send"
              type="submit"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
