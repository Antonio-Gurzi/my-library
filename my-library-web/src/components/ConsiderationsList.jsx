import { useState, useEffect } from "react";
import api from "../services/api";

function ConsiderationsList({ bookId }) {
  const [considerations, setConsiderations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsiderations = async () => {
      try {
        const response = await api.get(`/books/${bookId}/considerations`);
        setConsiderations(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ?? "Errore di connessione, riprova.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConsiderations();
  }, [bookId]);

  if (loading) return <p className="text-slate-500">Caricamento...</p>;
  if (error) return <p className="text-red-600">Errore: {error}</p>;

  return (
    <div>
      {considerations.length === 0 ? (
        <p className="text-slate-500">Nessuna considerazione inserita.</p>
      ) : (
        <ul className="list-disc pl-5">
          {considerations.map((consideration) => (
            <li key={consideration.id} className="text-slate-700">
              {consideration.note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ConsiderationsList;
