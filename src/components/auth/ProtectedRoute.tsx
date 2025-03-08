import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireParent?: boolean;
}

export default function ProtectedRoute({
  children,
  requireParent = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      // Not logged in, redirect to login
      navigate("/login");
    } else if (!isLoading && requireParent && user && !user.isParent) {
      // Logged in but not a parent, redirect to home
      navigate("/");
    }
  }, [user, isLoading, navigate, requireParent]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we're still here and have a user, render children
  if (user) {
    if (requireParent && !user.isParent) {
      return null; // Will redirect in the useEffect
    }
    return <>{children}</>;
  }

  // Otherwise render nothing (will redirect in useEffect)
  return null;
}
