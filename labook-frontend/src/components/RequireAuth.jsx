import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  console.log("allowed roles " + allowedRoles);
  console.log(auth.role);

  
  return allowedRoles.includes(auth?.role) ? (
  // return auth?.role?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;

// state={{ from: location }} replace
// esse código faz com que o o usuário consiga apertar o botão de voltar no navegador e voltar pra página onde ele estava.
// sem esse código o usuário fica preso nessa página de Unauthorized ou Login. Esse código substitui o histórico do usuário para que caso ele queira volta à página anterior, ele consiga.

// o <Outlet /> aqui significa que todas as rotas aninhadas a esta estarão protegidas por essa lógica.
