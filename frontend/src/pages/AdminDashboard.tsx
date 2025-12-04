import React, { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./AdminDashboard.css";

type IntentCategory = "orders" | "returns" | "product" | "smalltalk" | "other";

interface IntentItem {
  id: number;
  name: string;
  description: string;
  category: IntentCategory;
  lastUpdated: string;
  active: boolean;
}

interface TrainingSample {
  id: number;
  intentName: string;
  example: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "agent";
  canViewEscalatedOnly: boolean;
  status: "active" | "disabled";
}

interface LogEntry {
  id: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  conversationId: number;
  customerEmail?: string;
  message: string;
}

// --- MOCK DATA (UI ONLY) ---

const MOCK_INTENTS: IntentItem[] = [
  {
    id: 1,
    name: "product_info",
    description: "Customer asking about shirts, sizes, colours, or materials.",
    category: "product",
    lastUpdated: "2025-11-20",
    active: true,
  },
  {
    id: 2,
    name: "order_status",
    description: "Customer wants to check the status of an existing order.",
    category: "orders",
    lastUpdated: "2025-11-18",
    active: true,
  },
  {
    id: 3,
    name: "returns",
    description: "Customer asking about return / exchange policy or refund.",
    category: "returns",
    lastUpdated: "2025-11-17",
    active: true,
  },
  {
    id: 4,
    name: "greet",
    description: "Greetings and small talk handled by the chatbot.",
    category: "smalltalk",
    lastUpdated: "2025-11-10",
    active: true,
  },
  {
    id: 5,
    name: "abusive",
    description: "Customer is using abusive or inappropriate language.",
    category: "other",
    lastUpdated: "2025-10-30",
    active: true,
  },
];

const MOCK_TRAINING_SAMPLES: TrainingSample[] = [
  {
    id: 1,
    intentName: "order_status",
    example: "Can you check my order ORD-1001?",
  },
  {
    id: 2,
    intentName: "returns",
    example: "How do I return a shirt that doesn't fit?",
  },
  {
    id: 3,
    intentName: "product_info",
    example: "Do you have non-iron shirts in slim fit?",
  },
];

const MOCK_USERS: AdminUser[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    canViewEscalatedOnly: false,
    status: "active",
  },
  {
    id: 2,
    name: "Support Agent",
    email: "agent@example.com",
    role: "agent",
    canViewEscalatedOnly: true,
    status: "active",
  },
  {
    id: 3,
    name: "New Agent",
    email: "new.agent@example.com",
    role: "agent",
    canViewEscalatedOnly: true,
    status: "disabled",
  },
];

const MOCK_LOGS: LogEntry[] = [
  {
    id: 1,
    timestamp: "2025-11-25 11:10",
    level: "INFO",
    conversationId: 12,
    customerEmail: "alicetan@example.com",
    message: "Intent=order_status, escalated_to_agent=True",
  },
  {
    id: 2,
    timestamp: "2025-11-25 10:45",
    level: "WARN",
    conversationId: 9,
    customerEmail: "boblim@example.com",
    message: "NLU confidence low for message: 'I want to cancel my shirt'",
  },
  {
    id: 3,
    timestamp: "2025-11-24 16:32",
    level: "INFO",
    conversationId: 7,
    message: "Intent=returns, resolved_by_chatbot=True",
  },
  {
    id: 4,
    timestamp: "2025-11-24 09:15",
    level: "ERROR",
    conversationId: 4,
    customerEmail: "charlielee@example.com",
    message: "Failed to call Rasa NLU API",
  },
];

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Intents & response templates
  const [intentSearch, setIntentSearch] = useState("");
  const [intentCategoryFilter, setIntentCategoryFilter] =
    useState<IntentCategory | "all">("all");
  const [selectedIntentId, setSelectedIntentId] = useState<number | null>(1);
  const [responseTemplateDraft, setResponseTemplateDraft] = useState(
    "This is where you will edit the default response template for this intent."
  );

  // Training data section
  const [trainingExampleDraft, setTrainingExampleDraft] = useState("");
  const [trainingIntentName, setTrainingIntentName] = useState("order_status");

  // Users & permissions
  const [userSearch, setUserSearch] = useState("");

  // Logs & performance
  const [logSearch, setLogSearch] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState<"all" | "INFO" | "WARN" | "ERROR">("all");
  const [dateFilter, setDateFilter] = useState<"7d" | "30d" | "all">("7d");

  const filteredIntents = useMemo(() => {
    return MOCK_INTENTS.filter((intent) => {
      const matchesSearch =
        !intentSearch.trim() ||
        intent.name.toLowerCase().includes(intentSearch.toLowerCase()) ||
        intent.description.toLowerCase().includes(intentSearch.toLowerCase());

      const matchesCategory =
        intentCategoryFilter === "all" || intent.category === intentCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [intentSearch, intentCategoryFilter]);

  const selectedIntent =
    filteredIntents.find((i) => i.id === selectedIntentId) || filteredIntents[0];

  React.useEffect(() => {
    if (selectedIntent) {
      setResponseTemplateDraft(
        `Example default response template for "${selectedIntent.name}".\n\nYou can describe how the chatbot should reply, including placeholders like {order_number} or {customer_name}.`
      );
    }
  }, [selectedIntent?.id]);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      if (!userSearch.trim()) return true;
      const q = userSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [userSearch]);

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      const matchesSearch =
        !logSearch.trim() ||
        log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
        (log.customerEmail &&
          log.customerEmail.toLowerCase().includes(logSearch.toLowerCase())) ||
        String(log.conversationId).includes(logSearch);

      const matchesLevel =
        logLevelFilter === "all" || log.level === logLevelFilter;

      // For demo, dateFilter is only visual, so always true
      const matchesDate = true;

      return matchesSearch && matchesLevel && matchesDate;
    });
  }, [logSearch, logLevelFilter, dateFilter]);

  const handleSaveTemplate = () => {
    alert(
      "In the real system, this would save the updated response template for the selected intent."
    );
  };

  const handleAddTrainingExample = () => {
    if (!trainingExampleDraft.trim()) return;
    alert(
      `In the real system, this would add a new training example for intent "${trainingIntentName}".`
    );
    setTrainingExampleDraft("");
  };

  const handleCreateUser = () => {
    alert(
      "In the real system, this would open a form to create a new human agent account."
    );
  };

  const handleUpdatePermissions = (userId: number) => {
    alert(
      `In the real system, this would open a dialog to modify permissions for user ID ${userId}.`
    );
  };

  const handleDeleteIntent = () => {
    if (!selectedIntent) return;
    alert(
      `In the real system, this would delete the intent "${selectedIntent.name}" or mark it as archived.`
    );
  };

  const handleDeleteOldLogs = () => {
    alert(
      "In the real system, this would delete old log files beyond a certain retention period."
    );
  };

  return (
    <div className="admin-page">
      {/* Top nav */}
      <header className="admin-nav">
        <div className="admin-nav-left">
          <div className="admin-logo">Shirtify</div>
          <span className="admin-nav-label">System Administrator Console</span>
        </div>
        <div className="admin-nav-right">
          {user && <span className="admin-user-email">{user.email}</span>}
          <button type="button" className="admin-logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        {/* LEFT COLUMN: Intents & training data */}
        <section className="admin-col-left">
          {/* Intents list */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Chatbot intents & responses</h2>
                <p className="admin-card-subtitle">
                  Create, search, and edit intents and response templates.
                </p>
              </div>
              <button
                type="button"
                className="admin-primary-button"
                onClick={() =>
                  alert(
                    "In the real system, this would open a form to create a new intent."
                  )
                }
              >
                + New intent
              </button>
            </div>

            {/* Search + filter */}
            <div className="admin-intent-filters">
              <input
                type="text"
                className="admin-input"
                placeholder="Search intents by name or description..."
                value={intentSearch}
                onChange={(e) => setIntentSearch(e.target.value)}
              />
              <select
                className="admin-select"
                value={intentCategoryFilter}
                onChange={(e) =>
                  setIntentCategoryFilter(e.target.value as IntentCategory | "all")
                }
              >
                <option value="all">All categories</option>
                <option value="orders">Orders</option>
                <option value="returns">Returns</option>
                <option value="product">Product</option>
                <option value="smalltalk">Small talk</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Intents list */}
            <div className="admin-intent-list">
              {filteredIntents.length === 0 && (
                <div className="admin-empty-list">
                  No intents match your search and filters.
                </div>
              )}
              {filteredIntents.map((intent) => (
                <button
                  key={intent.id}
                  type="button"
                  className={
                    selectedIntent && selectedIntent.id === intent.id
                      ? "admin-intent-item admin-intent-item-selected"
                      : "admin-intent-item"
                  }
                  onClick={() => setSelectedIntentId(intent.id)}
                >
                  <div className="admin-intent-top-row">
                    <span className="admin-intent-name">{intent.name}</span>
                    <span
                      className={
                        intent.active
                          ? "admin-pill admin-pill-active"
                          : "admin-pill admin-pill-muted"
                      }
                    >
                      {intent.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="admin-intent-desc">{intent.description}</p>
                  <div className="admin-intent-meta-row">
                    <span className="admin-intent-cat">{intent.category}</span>
                    <span className="admin-intent-updated">
                      Updated {intent.lastUpdated}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Training data card */}
          <div className="admin-card">
            <div className="admin-card-header-row">
              <h3>Add training data</h3>
              <span className="admin-tag-muted">
                NLP model training (data only)
              </span>
            </div>
            <p className="admin-card-subtitle">
              Add new example phrases so that the NLP model can recognise new
              patterns. You’ll retrain the model later from your MLOps pipeline
              or CLI.
            </p>

            <div className="admin-training-form">
              <label className="admin-label">
                Intent
                <select
                  className="admin-select"
                  value={trainingIntentName}
                  onChange={(e) => setTrainingIntentName(e.target.value)}
                >
                  {MOCK_INTENTS.map((intent) => (
                    <option key={intent.id} value={intent.name}>
                      {intent.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-label">
                Training example
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder='e.g. "Can you help me track order ORD-1001?"'
                  value={trainingExampleDraft}
                  onChange={(e) => setTrainingExampleDraft(e.target.value)}
                />
              </label>

              <div className="admin-training-actions">
                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={handleAddTrainingExample}
                  disabled={!trainingExampleDraft.trim()}
                >
                  Add training example
                </button>
              </div>
            </div>

            {/* Existing examples (mock visual only) */}
            <div className="admin-training-list">
              <div className="admin-training-list-header">
                <span>Recent training examples</span>
              </div>
              {MOCK_TRAINING_SAMPLES.map((sample) => (
                <div key={sample.id} className="admin-training-item">
                  <span className="admin-training-intent">
                    {sample.intentName}
                  </span>
                  <span className="admin-training-example">{sample.example}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Response template, users, logs & metrics */}
        <section className="admin-col-right">
          {/* Response template editor + model info */}
          <div className="admin-card">
            <div className="admin-card-header-row">
              <h3>Response template</h3>
              <button
                type="button"
                className="admin-soft-button"
                onClick={handleDeleteIntent}
                disabled={!selectedIntent}
              >
                Delete / archive intent
              </button>
            </div>
            {selectedIntent ? (
              <>
                <p className="admin-card-subtitle">
                  Edit the default response template for{" "}
                  <strong>{selectedIntent.name}</strong>. Use this when products,
                  prices, or policies change.
                </p>
                <textarea
                  className="admin-textarea"
                  rows={5}
                  value={responseTemplateDraft}
                  onChange={(e) => setResponseTemplateDraft(e.target.value)}
                />
                <div className="admin-template-actions">
                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={handleSaveTemplate}
                  >
                    Save template
                  </button>
                  <span className="admin-hint-text">
                    This is UI-only. In the real system, this would update your
                    response configuration or Rasa domain.
                  </span>
                </div>
              </>
            ) : (
              <p className="admin-card-subtitle">
                Select an intent from the left to edit its response template.
              </p>
            )}

            {/* Model configuration & APIs */}
            <div className="admin-model-info">
              <h4>Current NLP model configuration</h4>
              <ul className="admin-model-list">
                <li>NLU engine: Rasa 3.x (DIETClassifier + CountVectors)</li>
                <li>Policies: RulePolicy, TEDPolicy, MemoizationPolicy</li>
                <li>Language: English</li>
              </ul>
              <h4>Connected APIs</h4>
              <ul className="admin-model-list">
                <li>FastAPI backend: /api/chat, /api/conversations</li>
                <li>Rasa NLU: /model/parse</li>
                <li>Database: PostgreSQL (orders, users, conversations)</li>
              </ul>
            </div>
          </div>

          {/* Users & permissions */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Human agents & permissions</h3>
                <p className="admin-card-subtitle">
                  Create accounts and control which chats agents can access.
                </p>
              </div>
              <button
                type="button"
                className="admin-primary-button"
                onClick={handleCreateUser}
              >
                + New user
              </button>
            </div>
            <div className="admin-user-filters">
              <input
                type="text"
                className="admin-input"
                placeholder="Search users by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="admin-user-table">
              <div className="admin-user-header-row">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Access</span>
                <span>Status</span>
                <span />
              </div>
              {filteredUsers.map((u) => (
                <div key={u.id} className="admin-user-row">
                  <span>{u.name}</span>
                  <span>{u.email}</span>
                  <span className="admin-user-role">{u.role}</span>
                  <span className="admin-user-access">
                    {u.canViewEscalatedOnly
                      ? "Escalated chats only"
                      : "All chats"}
                  </span>
                  <span
                    className={
                      u.status === "active"
                        ? "admin-status-pill admin-status-pill-active"
                        : "admin-status-pill admin-status-pill-muted"
                    }
                  >
                    {u.status}
                  </span>
                  <button
                    type="button"
                    className="admin-soft-button"
                    onClick={() => handleUpdatePermissions(u.id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Logs & performance metrics */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Logs & performance</h3>
                <p className="admin-card-subtitle">
                  Monitor chatbot logs, search conversations, and view key
                  metrics.
                </p>
              </div>
              <button
                type="button"
                className="admin-soft-button"
                onClick={handleDeleteOldLogs}
              >
                Delete old logs
              </button>
            </div>

            {/* Simple metrics cards */}
            <div className="admin-metrics-row">
              <div className="admin-metric-card">
                <div className="admin-metric-label">Accuracy (NLU)</div>
                <div className="admin-metric-value">92%</div>
                <div className="admin-metric-footnote">
                  Last 7 days · based on labelled samples
                </div>
              </div>
              <div className="admin-metric-card">
                <div className="admin-metric-label">Avg response time</div>
                <div className="admin-metric-value">0.8s</div>
                <div className="admin-metric-footnote">
                  Median chatbot reply latency
                </div>
              </div>
              <div className="admin-metric-card">
                <div className="admin-metric-label">Escalation rate</div>
                <div className="admin-metric-value">18%</div>
                <div className="admin-metric-footnote">
                  Chats handed to human agent
                </div>
              </div>
            </div>

            {/* Filters for logs */}
            <div className="admin-logs-filters">
              <input
                type="text"
                className="admin-input"
                placeholder="Search logs by message, email, or conversation ID..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
              <select
                className="admin-select"
                value={logLevelFilter}
                onChange={(e) =>
                  setLogLevelFilter(e.target.value as "all" | "INFO" | "WARN" | "ERROR")
                }
              >
                <option value="all">All levels</option>
                <option value="INFO">Info</option>
                <option value="WARN">Warning</option>
                <option value="ERROR">Error</option>
              </select>
              <select
                className="admin-select"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.target.value as "7d" | "30d" | "all")
                }
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>

            {/* Logs list */}
            <div className="admin-logs-list">
              {filteredLogs.length === 0 && (
                <div className="admin-empty-list">
                  No logs match the current filters.
                </div>
              )}
              {filteredLogs.map((log) => (
                <div key={log.id} className="admin-log-row">
                  <div className="admin-log-main">
                    <span
                      className={`admin-log-level admin-log-level-${log.level.toLowerCase()}`}
                    >
                      {log.level}
                    </span>
                    <span className="admin-log-message">{log.message}</span>
                  </div>
                  <div className="admin-log-meta">
                    <span className="admin-log-time">{log.timestamp}</span>
                    <span className="admin-log-conv">
                      Conv #{log.conversationId}
                    </span>
                    {log.customerEmail && (
                      <span className="admin-log-email">{log.customerEmail}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
