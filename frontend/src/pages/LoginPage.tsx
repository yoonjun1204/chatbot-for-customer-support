import React, { useState } from "react";
import { useAuth, type UserRole, type AuthUser } from "../auth/AuthContext";
import "./LoginPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface LoginResponse {
  id: number;
  email: string;
  name?: string | null;
  role: UserRole;
}

const roles: { key: UserRole; label: string; description: string }[] = [
  {
    key: "customer",
    label: "Customer",
    description: "Shopper who wants help with shirts and orders.",
  },
  {
    key: "admin",
    label: "Admin",
    description: "Manage users, orders and overall metrics.",
  },
  {
    key: "agent",
    label: "Human Agent",
    description: "Handle live escalations and customer conversations.",
  },
];

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError("Please select whether you are Customer, Admin, or Human Agent.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg: any = null;
        try {
          msg = await res.json();
        } catch {
          // ignore
        }
        throw new Error(msg?.detail || "Login failed");
      }

      const data: LoginResponse = await res.json();

      if (data.role !== selectedRole) {
        throw new Error(
          `This account is registered as '${data.role}'. Please select the correct role.`
        );
      }

      const authUser: AuthUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      };
      login(authUser);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header-row">
          <div className="login-logo">Shirtify</div>
          <div className="login-tag">Support Portal</div>
        </div>

        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">
          Choose how you want to sign in and access the Shirtify support tools.
        </p>

        {/* Role selection */}
        <div className="role-grid">
          {roles.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`role-card ${
                selectedRole === r.key ? "role-card-selected" : ""
              }`}
              onClick={() => setSelectedRole(r.key)}
            >
              <div className="role-card-label">{r.label}</div>
              <div className="role-card-description">{r.description}</div>
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Email
            <input
              type="email"
              className="login-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="login-demo-hint">
            Demo accounts:
            <ul>
              <li>Customer: alicetan@example.com / password123</li>
              <li>Admin: admin@example.com / password123</li>
              <li>Agent: agent@example.com / password123</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
