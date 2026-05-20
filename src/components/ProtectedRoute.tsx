import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { token, role } = useAuthStore();

    // If there's no token, send them straight to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified, ensure the user has permission
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />; // Or to a specific "Unauthorized" page
    }

    return <Outlet />;
};
