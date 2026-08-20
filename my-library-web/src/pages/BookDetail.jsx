import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

// funzione di supporto per formattare le date in italiano
// riceve una stringa data (o null) e restituisce un testo leggibile
function formatDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ?? "Errore di connessione, riprova.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Caricamento libro...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-600">Errore: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-800">{book.title}</h1>
        <p className="text-slate-500 mb-6">{book.author}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Pagine totali</p>
            <p className="font-semibold text-slate-800">{book.total_pages}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Data inizio</p>
            <p className="font-semibold text-slate-800">
              {formatDate(book.start_date) ?? "Non ancora iniziato"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Data fine</p>
            <p className="font-semibold text-slate-800">
              {formatDate(book.end_date) ?? "In corso"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
