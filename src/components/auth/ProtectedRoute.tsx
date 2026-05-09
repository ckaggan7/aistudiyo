import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type Props = {
  children: React.ReactNode;
  requireRole?: AppRole;
};

export default function ProtectedRoute({ children, requireRole }: Props) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}