import React, { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";

type Sender = "user" | "bot";

interface ChatMessage {
  id: number;
  sender: Sender;
  text: string;
}

interface ChatPayload {
  requires_login?: boolean;
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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 simple "login" state (email only for prototype)
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState("");

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
          // 🔐 If logged in, send email; if not, send null so backend treats as guest
          user_id: userEmail,
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data: ChatApiResponse = await res.json();
      setConversationId(data.conversation_id);
      addMessage("bot", data.reply);
      setQuickReplies(data.quick_replies || []);

      // 🔐 If backend says login is required, open login modal
      if (data.payload && data.payload.requires_login && !userEmail) {
        setShowLoginModal(true);
      }

      // Optional: you could also use data.payload.order if you want to render
      // a more structured "order card" in the UI in future.
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
    // setQuickReplies([]); // optional
  };

  // simple login handler – front-end only (prototype)
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = loginEmailInput.trim();
    if (!trimmed) return;

    setUserEmail(trimmed);
    setShowLoginModal(false);
    setLoginEmailInput("");

    addMessage(
      "bot",
      `You're now signed in as ${trimmed}. You can ask me to check your order status.`
    );
  };

  const handleSignOut = () => {
    setUserEmail(null);
    addMessage(
      "bot",
      "You’ve signed out. You can still ask about products, but order status requires sign in."
    );
  };

  // When the widget opens for the first time, show an initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage(
        "bot",
        "Hi! 👋 I'm your shirt support chatbot. I can help with product info, order status (for signed-in customers), and returns."
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
      {/* Floating open/close button */}
      {!isOpen && (
        <button
          className="chat-toggle-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
        >
          💬
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chat-widget">
          <header className="chat-header">
            <div>
              <div className="chat-title">Shirt Support</div>
              <div className="chat-subtitle">
                {userEmail
                  ? `Signed in as ${userEmail}`
                  : "Guest · Sign in to check order status"}
              </div>
            </div>
            <div className="chat-header-actions">
              {!userEmail ? (
                <button
                  className="chat-login-button"
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                >
                  Sign in
                </button>
              ) : (
                <button
                  className="chat-login-button"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              )}
              <button
                className="chat-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
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

          {/* 🔐 Simple login modal */}
          {showLoginModal && (
            <div className="chat-login-backdrop">
              <div className="chat-login-modal">
                <h3>Sign in to check your orders</h3>
                <p className="chat-login-hint"></p>
                <form onSubmit={handleLoginSubmit} className="chat-login-form">
                  <input
                    type="email"
                    className="chat-input"
                    placeholder="your.email@example.com"
                    value={loginEmailInput}
                    onChange={(e) => setLoginEmailInput(e.target.value)}
                    required
                  />
                  <div className="chat-login-actions">
                    <button
                      type="button"
                      className="chat-login-cancel"
                      onClick={() => setShowLoginModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="chat-login-confirm">
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
