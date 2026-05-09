import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  if (!hasRole("super_admin")) return <Navigate to="/superadmin/login" replace />;
  return <>{children}</>;
}