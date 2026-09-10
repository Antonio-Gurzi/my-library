// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      // ignoriamo volutamente l'errore: come deciso, l'utente deve uscire
      // comunque lato client anche se la chiamata al server fallisce
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-stone-900 border-b border-amber-800 px-4 py-3 flex items-center justify-center gap-4 sm:gap-6">
      <Link
        to="/dashboard"
        className="text-amber-200 hover:text-amber-100 font-bold text-lg transition"
      >
        Home
      </Link>
      <button
        onClick={handleLogout}
        className="text-amber-700 hover:text-amber-100 font-bold text-lg transition"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;