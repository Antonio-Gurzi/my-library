import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  //prendo il token dal local per verificare se l utente è autenticato
  const token = localStorage.getItem("token");
  // se non è autenticato lo rendirizzo nella pagina di login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // altrimenti mostro la pag
  return <Outlet />;
}

export default ProtectedRoute;
