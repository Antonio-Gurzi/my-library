import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ConsiderationsList from "../components/ConsiderationsList";
import AddConsiderationModal from "../components/AddConsiderationModal";

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

  const [isConsiderationsOpen, setIsConsiderationsOpen] = useState(false);
  const [isAddConsiderationFormOpen, setIsAddConsiderationFormOpen] =
    useState(false);

  // stato delle considerazioni
  const [considerations, setConsiderations] = useState([]);
  const [considerationsLoading, setConsiderationsLoading] = useState(true);
  const [considerationsError, setConsiderationsError] = useState(null);
  const [editingConsideration, setEditingConsideration] = useState(null);

  // apro modale in edit mode
  const handleEditConsiderationClick = (consideration) => {
    setEditingConsideration(consideration);
    setIsAddConsiderationFormOpen(true);
  };
  const handleCloseModal = () => {
    setIsAddConsiderationFormOpen(false);
    setEditingConsideration(null);
  };

  // eliminare considerazione
  const handleDeleteConsideration = async (considerationId) => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questa considerazione?",
    );
    if (!confirmed) return;
    try {
      await api.delete(`/books/${id}/considerations/${considerationId}`);
      setConsiderations(considerations.filter((c) => c.id !== considerationId));
    } catch (err) {
      setConsiderationsError(
        err.response?.data?.message ?? "Errore durante l'eliminazione.",
      );
    }
  };

  // fuori dall'useEffect: dovrà essere richiamata anche dopo il salvataggio
  const fetchConsiderations = async () => {
    try {
      const response = await api.get(`/books/${id}/considerations`);
      setConsiderations(response.data);
    } catch (err) {
      setConsiderationsError(
        err.response?.data?.message ?? "Errore di connessione, riprova.",
      );
    } finally {
      setConsiderationsLoading(false);
    }
  };

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

  //useEffect dedicato alle considerazioni
  useEffect(() => {
    fetchConsiderations();
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
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

        <div className="bg-white rounded-xl shadow-sm mt-4 overflow-hidden">
          <div className="flex items-center justify-between w-full p-4">
            <button
              onClick={() => setIsConsiderationsOpen(!isConsiderationsOpen)}
              className="flex items-center gap-2 flex-1"
            >
              <span className="font-semibold text-slate-800">
                Considerazioni
              </span>
              <span
                className={`transition-transform ${isConsiderationsOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            <button
              className="text-indigo-600 font-semibold px-3"
              onClick={() => setIsAddConsiderationFormOpen(true)}
            >
              Aggiungi +
            </button>
          </div>

          {isConsiderationsOpen && (
            <div className="border-t border-slate-100 p-4">
              <ConsiderationsList
                considerations={considerations}
                loading={considerationsLoading}
                error={considerationsError}
                onDeleteConsideration={handleDeleteConsideration}
                onEditConsideration={handleEditConsiderationClick}
              />
            </div>
          )}
        </div>
      </div>

      {isAddConsiderationFormOpen && (
        <AddConsiderationModal
          bookId={id}
          onClose={handleCloseModal}
          consideration={editingConsideration}
          onConsiderationSaved={(savedConsideration) => {
            setConsiderations([
              ...considerations.filter((c) => c.id !== savedConsideration.id),
              savedConsideration,
            ]);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}

export default BookDetail;
