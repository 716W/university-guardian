import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isInitialized, role } = useAuthStore();

    if (!isInitialized) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If not authenticated, send them straight to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified, ensure the user has permission
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />; // Or to a specific "Unauthorized" page
    }

    return <Outlet />;
};
