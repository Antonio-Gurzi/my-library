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
        // chiamo l endpoint di login insieme all oggetto formData
        const response = await api.post("/login", formData);
        // setto il token nel localStorage
        localStorage.setItem("token", response.data.token);
        // reindirizzo l utente nella dashboard
        navigate("/dashboard");
      } else {
        // chiamo l endopoint di registrazione
        await api.post("/register", formData);

        // mantengo i campi che mi servono SOLO per la login
        const loginCredentials = {
          email: formData.email,
          password: formData.password,
        };
        // una costa che l utente è registrato chiamo l endopoint di registrazione
        const response = await api.post("/login", loginCredentials);
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      // err.response potrebbe non esistere (es. server irraggiungibile),
      // quindi usiamo ?. per non generare un secondo errore mentre gestiamo il primo
      setError(err.response?.data?.message ?? "Errore di connessione, riprova.");
    } finally {
      setLoading(false);
    }
  };

  // passo da login a registrazione (o viceversa) pulendo l'errore precedente
  const handleToggleMode = () => {
    setError(null);
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">
          {isLogin ? "Accedi" : "Registrati"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* se non è login ,mostra il campo nome */}
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
          {/* se non è login ,mostra il campo conferma password */}
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
            className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-md transition"
          >
            {loading ? "Caricamento..." : isLogin ? "Accedi" : "Registrati"}
          </button>
        </form>

        <button
          onClick={handleToggleMode}
          className="mt-4 w-full text-sm text-blue-600 hover:underline text-center"
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