import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'organizer' | 'attendee';
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
};
