import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RoleSelectPage from "./pages/auth/RoleSelectPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ClientsPage from "./pages/clients/ClientsPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import InvoiceDetailPage from "./pages/invoices/InvoiceDetailPage";
import ClientPortalPage from "./pages/portal/ClientPortalPage";
import ForgotPasswordPage from "./pages/auth/ForgetPasswordPage";
function ProtectedRoute({ children, requireRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.role) return <Navigate to="/role-select" replace />;
  if (requireRole && user.role !== requireRole)
    return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={user?.role ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/register"
        element={user?.role ? <Navigate to="/dashboard" /> : <RegisterPage />}
      />
      <Route
        path="/role-select"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : user.role ? (
            <Navigate to="/dashboard" />
          ) : (
            <RoleSelectPage />
          )
        }
      />

      {/* Freelancer Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireRole="freelancer">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/:id" element={<InvoiceDetailPage />} />
      </Route>

      {/* Client Portal */}
      <Route path="/portal/:token" element={<ClientPortalPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
