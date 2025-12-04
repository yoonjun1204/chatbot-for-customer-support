// src/pages/AgentDashboard.tsx
import React, { useState, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import "./AgentDashboard.css";

type ChatStatus = "pending" | "active" | "resolved";
type ChatIntent = "refund" | "order_issue" | "product_info" | "other";

interface ChatMessage {
  id: number;
  sender: "customer" | "bot" | "agent";
  text: string;
  timestamp: string;
}

interface EscalatedChat {
  id: number;
  customerName: string;
  orderNumber?: string;
  intent: ChatIntent;
  status: ChatStatus;
  lastMessage: string;
  updatedAt: string;
  hasAlert: boolean; // chatbot failed / escalated
  messages: ChatMessage[];
  internalNotes: string;
}

const MOCK_CHATS: EscalatedChat[] = [
  {
    id: 1,
    customerName: "Alice Tan",
    orderNumber: "ORD-1001",
    intent: "order_issue",
    status: "pending",
    lastMessage: "The chatbot couldn’t help me update my delivery address.",
    updatedAt: "11:15 AM",
    hasAlert: true,
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "Hi, I need to change the delivery address for ORD-1001.",
        timestamp: "11:10 AM",
      },
      {
        id: 2,
        sender: "bot",
        text: "I’m sorry, I wasn’t able to update your address automatically. I’ll escalate this to a human agent.",
        timestamp: "11:11 AM",
      },
    ],
    internalNotes: "Customer wants to change address before shipment. Check courier cut-off time.",
  },
  {
    id: 2,
    customerName: "Bob Lim",
    orderNumber: "ORD-1003",
    intent: "refund",
    status: "active",
    lastMessage: "I want to return two shirts, the size is wrong.",
    updatedAt: "10:40 AM",
    hasAlert: false,
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "I want to return two shirts, the size is wrong.",
        timestamp: "10:32 AM",
      },
      {
        id: 2,
        sender: "bot",
        text: "I can share our return policy, or I can connect you to a human agent for a manual refund process.",
        timestamp: "10:33 AM",
      },
      {
        id: 3,
        sender: "customer",
        text: "Please connect me to a human.",
        timestamp: "10:34 AM",
      },
    ],
    internalNotes: "Explain return window and check if worn. Offer store credit or refund.",
  },
  {
    id: 3,
    customerName: "Charlie Lee",
    orderNumber: undefined,
    intent: "product_info",
    status: "resolved",
    lastMessage: "Thanks, that answered my question!",
    updatedAt: "Yesterday",
    hasAlert: false,
    messages: [
      {
        id: 1,
        sender: "customer",
        text: "Do you have non-iron shirts in slim fit?",
        timestamp: "Yesterday",
      },
      {
        id: 2,
        sender: "bot",
        text: "Yes, we have non-iron slim fit shirts. A human agent will share more details.",
        timestamp: "Yesterday",
      },
      {
        id: 3,
        sender: "agent",
        text: "We have non-iron slim fit in white, light blue, and navy. Sizes XS–XL.",
        timestamp: "Yesterday",
      },
    ],
    internalNotes: "Resolved with product recommendation.",
  },
];

const intentLabel: Record<ChatIntent, string> = {
  refund: "Refund",
  order_issue: "Order issue",
  product_info: "Product info",
  other: "Other",
};

const statusLabel: Record<ChatStatus, string> = {
  pending: "Pending",
  active: "Active",
  resolved: "Resolved",
};

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [intentFilter, setIntentFilter] = useState<ChatIntent | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ChatStatus | "all">("all");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(1);

  const [draftReply, setDraftReply] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  const filteredChats = useMemo(() => {
    return MOCK_CHATS.filter((chat) => {
      const matchesSearch =
        !searchTerm.trim() ||
        chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.orderNumber &&
          chat.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIntent =
        intentFilter === "all" || chat.intent === intentFilter;

      const matchesStatus =
        statusFilter === "all" || chat.status === statusFilter;

      return matchesSearch && matchesIntent && matchesStatus;
    });
  }, [searchTerm, intentFilter, statusFilter]);

  const selectedChat = filteredChats.find(
    (c) => c.id === selectedChatId
  ) || filteredChats[0];

  // keep draft notes in local state when switching chats (demo only)
  React.useEffect(() => {
    if (selectedChat) {
      setDraftNotes(selectedChat.internalNotes || "");
      setDraftReply("");
    }
  }, [selectedChatId, selectedChat?.id]);

  const handleSelectChat = (id: number) => {
    setSelectedChatId(id);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // purely visual for now
    console.log("Status changed to:", e.target.value);
  };

  const handleArchive = () => {
    // demo only UI
    alert("In the real system, this would archive/close the chat.");
  };

  const handleSaveNotes = () => {
    alert("Notes saved (UI only for now).");
  };

  const handleCleanLogs = () => {
    alert("In the real system, this would remove duplicate/irrelevant logs.");
  };

  const handleSendReply = () => {
    if (!draftReply.trim()) return;
    alert("Reply sent to customer (UI only). You edited it before sending. 😊");
    setDraftReply("");
  };

  return (
    <div className="agent-page">
      <header className="agent-nav">
        <div className="agent-nav-left">
          <div className="agent-logo">Shirtify</div>
          <span className="agent-nav-label">Human Agent Console</span>
        </div>
        <div className="agent-nav-right">
          {user && <span className="agent-user-email">{user.email}</span>}
          <button
            type="button"
            className="agent-logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="agent-main">
        {/* LEFT: Sidebar – search + filters + chat list */}
        <section className="agent-sidebar">
          <div className="agent-sidebar-header">
            <h2>Escalated chats</h2>
            <p className="agent-sidebar-subtitle">
              Chats where the chatbot could not fully resolve the issue.
            </p>
          </div>

          {/* Search (by keyword or order number) */}
          <div className="agent-search-box">
            <label className="agent-search-label">
              Search chats
              <input
                type="text"
                className="agent-search-input"
                placeholder="Name, order number, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
          </div>

          {/* Filters: intent + status */}
          <div className="agent-filters">
            <div className="agent-filter-group">
              <div className="agent-filter-label">Intent</div>
              <div className="agent-filter-chips">
                <button
                  type="button"
                  className={
                    intentFilter === "all"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setIntentFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={
                    intentFilter === "refund"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setIntentFilter("refund")}
                >
                  Refund
                </button>
                <button
                  type="button"
                  className={
                    intentFilter === "order_issue"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setIntentFilter("order_issue")}
                >
                  Order issue
                </button>
                <button
                  type="button"
                  className={
                    intentFilter === "product_info"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setIntentFilter("product_info")}
                >
                  Product info
                </button>
              </div>
            </div>

            <div className="agent-filter-group">
              <div className="agent-filter-label">Status</div>
              <div className="agent-filter-chips">
                <button
                  type="button"
                  className={
                    statusFilter === "all"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={
                    statusFilter === "pending"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className={
                    statusFilter === "active"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={
                    statusFilter === "resolved"
                      ? "agent-chip agent-chip-active"
                      : "agent-chip"
                  }
                  onClick={() => setStatusFilter("resolved")}
                >
                  Resolved
                </button>
              </div>
            </div>
          </div>

          {/* Chat list */}
          <div className="agent-chat-list">
            {filteredChats.length === 0 && (
              <div className="agent-empty-list">
                No chats match your search and filters.
              </div>
            )}
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                className={
                  selectedChat && selectedChat.id === chat.id
                    ? "agent-chat-item agent-chat-item-selected"
                    : "agent-chat-item"
                }
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className="agent-chat-item-top">
                  <span className="agent-chat-customer">
                    {chat.customerName}
                  </span>
                  {chat.orderNumber && (
                    <span className="agent-tag agent-tag-light">
                      {chat.orderNumber}
                    </span>
                  )}
                </div>
                <div className="agent-chat-item-middle">
                  <span className="agent-tag agent-tag-intent">
                    {intentLabel[chat.intent]}
                  </span>
                  <span
                    className={`agent-tag agent-tag-status-${chat.status}`}
                  >
                    {statusLabel[chat.status]}
                  </span>
                  {chat.hasAlert && (
                    <span className="agent-alert-badge">
                      Chatbot failed to resolve
                    </span>
                  )}
                </div>
                <div className="agent-chat-item-bottom">
                  <p className="agent-chat-snippet">{chat.lastMessage}</p>
                  <span className="agent-chat-time">{chat.updatedAt}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT: Chat details + logs + manual reply + notes */}
        <section className="agent-content">
          {selectedChat ? (
            <>
              {/* Header: basic info + status + archive */}
              <div className="agent-chat-header">
                <div>
                  <div className="agent-chat-title-row">
                    <h2>{selectedChat.customerName}</h2>
                    {selectedChat.orderNumber && (
                      <span className="agent-tag agent-tag-light">
                        {selectedChat.orderNumber}
                      </span>
                    )}
                  </div>
                  <div className="agent-chat-subtitle">
                    Intent:{" "}
                    <span className="agent-subtle-pill">
                      {intentLabel[selectedChat.intent]}
                    </span>
                    <span className="agent-subtle-separator">•</span>
                    <span>Chat escalated from chatbot</span>
                  </div>
                </div>

                <div className="agent-chat-header-actions">
                  <select
                    className="agent-status-select"
                    defaultValue={selectedChat.status}
                    onChange={handleStatusChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    type="button"
                    className="agent-archive-button"
                    onClick={handleArchive}
                  >
                    Archive chat
                  </button>
                </div>
              </div>

              {/* Alerts + controls */}
              {selectedChat.hasAlert && (
                <div className="agent-alert-card">
                  <div className="agent-alert-title">
                    Chatbot could not resolve this issue
                  </div>
                  <p className="agent-alert-text">
                    This chat was escalated because the chatbot failed to
                    answer the customer’s question or required manual handling.
                    You can review the conversation log below and respond
                    manually.
                  </p>
                </div>
              )}

              {/* Conversation log */}
              <div className="agent-chat-log-card">
                <div className="agent-card-header-row">
                  <h3>Conversation log</h3>
                  <button
                    type="button"
                    className="agent-clean-logs-button"
                    onClick={handleCleanLogs}
                  >
                    Clean up logs
                  </button>
                </div>
                <div className="agent-chat-log">
                  {selectedChat.messages.map((m) => (
                    <div key={m.id} className="agent-message-row">
                      <div className="agent-message-meta">
                        <span
                          className={`agent-role-chip agent-role-${m.sender}`}
                        >
                          {m.sender === "customer"
                            ? "Customer"
                            : m.sender === "bot"
                            ? "Chatbot"
                            : "You"}
                        </span>
                        <span className="agent-message-time">
                          {m.timestamp}
                        </span>
                      </div>
                      <div className="agent-message-text">{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual reply composer */}
              <div className="agent-reply-card">
                <h3>Manual reply</h3>
                <p className="agent-reply-hint">
                  Draft your response to the customer. You can{" "}
                  <strong>edit your message before sending</strong> to ensure it
                  is accurate and polite.
                </p>
                <textarea
                  className="agent-textarea"
                  rows={3}
                  placeholder="Type your reply to the customer here..."
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                />
                <div className="agent-reply-actions">
                  <button
                    type="button"
                    className="agent-send-button"
                    onClick={handleSendReply}
                    disabled={!draftReply.trim()}
                  >
                    Send reply
                  </button>
                </div>
              </div>

              {/* Internal notes */}
              <div className="agent-notes-card">
                <h3>Internal notes</h3>
                <p className="agent-notes-hint">
                  Add notes visible only to agents. Future agents can see the
                  context when this customer contacts support again.
                </p>
                <textarea
                  className="agent-textarea"
                  rows={3}
                  placeholder="Notes for other agents (refund reason, promises made, follow-up dates, etc.)"
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                />
                <div className="agent-notes-actions">
                  <button
                    type="button"
                    className="agent-notes-save-button"
                    onClick={handleSaveNotes}
                  >
                    Save note
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="agent-empty-state">
              <h2>Select a chat</h2>
              <p>
                Choose an escalated chat from the left panel to review the
                chatbot’s conversation, add internal notes, and send a manual
                reply.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AgentDashboard;
