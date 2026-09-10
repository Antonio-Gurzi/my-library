import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import FormInput from "../components/FormInput";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    password_confirmation: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post("/login", formData);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        await api.post("/register", formData);

        const loginCredentials = {
          email: formData.email,
          password: formData.password,
        };
        const response = await api.post("/login", loginCredentials);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Errore di connessione, riprova.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setError(null);
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-around bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 px-4 ">
      
      <h1 className="text-2xl font-bold text-amber-700 text-center">
        Benvenuto su MyLibrary, la tua libreria digitale personale!
      </h1>
      <div className="w-full max-w-sm bg-amber-100 border border-amber-700 rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-stone-800 text-center mb-6">
          {isLogin ? "Accedi" : "Registrati"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <FormInput
              type="text"
              name="name"
              placeholder="Scrivi il tuo nome"
              value={formData.name}
              onChange={handleChange}
            />
          )}
          <FormInput
            type="email"
            name="email"
            placeholder="Scrivi la tua email"
            value={formData.email}
            onChange={handleChange}
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Scrivi la tua password"
            value={formData.password}
            onChange={handleChange}
          />
          {!isLogin && (
            <FormInput
              type="password"
              name="password_confirmation"
              placeholder="conferma la tua password"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-amber-700 hover:bg-amber-800 text-amber-50 font-semibold py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Caricamento..." : isLogin ? "Accedi" : "Registrati"}
          </button>
        </form>

        <button
          onClick={handleToggleMode}
          className="mt-4 w-full text-sm text-amber-700 hover:text-amber-900 font-semibold text-center transition"
        >
          {isLogin
            ? "Non hai un account? Registrati"
            : "Hai già un account? Accedi"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
