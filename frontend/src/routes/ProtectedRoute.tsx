import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: Props) => {
  const user = useAuthStore((state) => state.user);
  return user ? children : <Navigate to="/auth/login" replace />;
};
