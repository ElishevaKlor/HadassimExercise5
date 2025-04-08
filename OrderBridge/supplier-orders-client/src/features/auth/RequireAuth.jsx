import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loading from '../../Components/Loading'
const RequireAuth = ({ allowedRoles }) => {
  const { role } = useAuth();

  if (!role) {
    return <Loading/>
  }
console.log(role)
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
