import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("userId"); 

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
