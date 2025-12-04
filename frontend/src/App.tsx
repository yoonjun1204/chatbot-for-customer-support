import "./App.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import CustomerHome from "./pages/CustomerHome";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";

const AppInner: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === "customer") {
    return <CustomerHome />;
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  if (user.role === "agent") {
    return <AgentDashboard />;
  }

  // Fallback
  return <LoginPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
};

export default App;
