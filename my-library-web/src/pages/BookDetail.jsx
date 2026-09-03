import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ConsiderationsList from "../components/ConsiderationsList";
import AddConsiderationModal from "../components/AddConsiderationModal";
import QuotesList from "../components/QuotesList";
import AddQuoteModal from "../components/AddQuoteModal";
import ReadingSessionsList from "../components/ReadingSessionsList";
import AddReadingSessionModal from "../components/AddReadingSessionModal";
import { formatDate } from "../utils/formatDate";

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // considerazioni
  const [isConsiderationsOpen, setIsConsiderationsOpen] = useState(false);
  const [isAddConsiderationFormOpen, setIsAddConsiderationFormOpen] =
    useState(false);

  // stato delle considerazioni
  const [considerations, setConsiderations] = useState([]);
  const [considerationsLoading, setConsiderationsLoading] = useState(true);
  const [considerationsError, setConsiderationsError] = useState(null);
  const [editingConsideration, setEditingConsideration] = useState(null);

  // stato delle quote
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);
  const [isAddQuoteFormOpen, setIsAddQuoteFormOpen] = useState(false);

  // stato delle sessioni di lettura
  const [readingSessions, setReadingSessions] = useState([]);
  const [readingSessionsLoading, setReadingSessionsLoading] = useState(true);
  const [readingSessionsError, setReadingSessionsError] = useState(null);
  const [editingReadingSession, setEditingReadingSession] = useState(null);
  const [isReadingSessionsOpen, setIsReadingSessionsOpen] = useState(false);
  const [isAddReadingSessionFormOpen, setIsAddReadingSessionFormOpen] =
    useState(false);

  // apro modale in edit mode
  const handleEditConsiderationClick = (consideration) => {
    setEditingConsideration(consideration);
    setIsAddConsiderationFormOpen(true);
  };
  const handleCloseConsiderationModal = () => {
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

  // fuori dall'useEffect per best practice nel caso in cui avessi necessità di richiamarla in un altra parte del codice
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

  // fetch delle quote
  const fetchQuotes = async () => {
    try {
      const response = await api.get(`/books/${id}/quotes`);
      setQuotes(response.data);
    } catch (err) {
      setQuotesError(
        err.response?.data?.message ?? "Errore di connessione, riprova.",
      );
    } finally {
      setQuotesLoading(false);
    }
  };

  // fetch delle sessioni di lettura
  const fetchReadingSessions = async () => {
    try {
      const response = await api.get(`/books/${id}/reading-sessions`);
      setReadingSessions(response.data);
    } catch (err) {
      setReadingSessionsError(
        err.response?.data?.message ?? "Errore di connessione, riprova.",
      );
    } finally {
      setReadingSessionsLoading(false);
    }
  };

  // useEffect per prendere i dati del libro
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

  // useEffect dedicato alle quote
  useEffect(() => {
    fetchQuotes();
  }, [id]);

  // useEffect dedicato alle sessioni di lettura
  useEffect(() => {
    fetchReadingSessions();
  }, [id]);

  // mode edit per le quote
  const handleEditQuoteClick = (quote) => {
    setEditingQuote(quote);
    setIsAddQuoteFormOpen(true);
  };

  // chiusura modale quote
  const handleCloseQuoteModal = () => {
    setIsAddQuoteFormOpen(false);
    setEditingQuote(null);
  };

  // eliminazione quote
  const handleDeleteQuote = async (quoteId) => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questa citazione?",
    );
    if (!confirmed) return;
    try {
      await api.delete(`/books/${id}/quotes/${quoteId}`);
      setQuotes(quotes.filter((q) => q.id !== quoteId));
    } catch (err) {
      setQuotesError(
        err.response?.data?.message ?? "Errore durante l'eliminazione.",
      );
    }
  };

  // mode edit per le sessioni di lettura
  const handleEditReadingSessionClick = (readingSession) => {
    setEditingReadingSession(readingSession);
    setIsAddReadingSessionFormOpen(true);
  };

  // chiusura modale sessioni di lettura
  const handleCloseReadingSessionModal = () => {
    setIsAddReadingSessionFormOpen(false);
    setEditingReadingSession(null);
  };

  // eliminazione sessione di lettura
  const handleDeleteReadingSession = async (readingSessionId) => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questa sessione di lettura?",
    );
    if (!confirmed) return;
    try {
      await api.delete(`/books/${id}/reading-sessions/${readingSessionId}`);
      setReadingSessions(
        readingSessions.filter((rs) => rs.id !== readingSessionId),
      );
    } catch (err) {
      setReadingSessionsError(
        err.response?.data?.message ?? "Errore durante l'eliminazione.",
      );
    }
  };

  // --------------------------- stati statistiche libro  ---------------------------
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // --------------------------- fetch statistiche libro  ---------------------------
  const fetchStats = async () => {
    try {
      const response = await api.get(`/books/${id}/stats`);
      setStats(response.data);
    } catch (err) {
      setStatsError(
        err.response?.data?.message ?? "Errore di connessione, riprova.",
      );
    } finally {
      setStatsLoading(false);
    }
  };

  // useEffect dedicato alle statistiche
  useEffect(() => {
    fetchStats();
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
          {/* stats giorni totali di lettura */}
          <div>
            <p className="text-sm text-slate-500">Giorni totali di lettura</p>
            <p className="font-semibold text-slate-800">
              {statsLoading
                ? "Caricamento..."
                : statsError
                  ? "Errore"
                  : stats.total_reading_time_days}
            </p>
          </div>
        </div>

        {/* accordion considerazioni */}
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

        {/* accordion quotes */}
        <div className="bg-white rounded-xl shadow-sm mt-4 overflow-hidden">
          <div className="flex items-center justify-between w-full p-4">
            <button
              onClick={() => setIsQuotesOpen(!isQuotesOpen)}
              className="flex items-center gap-2 flex-1"
            >
              <span className="font-semibold text-slate-800">Citazioni</span>
              <span
                className={`transition-transform ${isQuotesOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            <button
              className="text-indigo-600 font-semibold px-3"
              onClick={() => setIsAddQuoteFormOpen(true)}
            >
              Aggiungi +
            </button>
          </div>

          {isQuotesOpen && (
            <div className="border-t border-slate-100 p-4">
              <QuotesList
                quotes={quotes}
                loading={quotesLoading}
                error={quotesError}
                onDeleteQuote={handleDeleteQuote}
                onEditQuote={handleEditQuoteClick}
              />
            </div>
          )}
        </div>

        {/* accordion sessioni di lettura */}
        <div className="bg-white rounded-xl shadow-sm mt-4 overflow-hidden">
          <div className="flex items-center justify-between w-full p-4">
            <button
              onClick={() => setIsReadingSessionsOpen(!isReadingSessionsOpen)}
              className="flex items-center gap-2 flex-1"
            >
              <span className="font-semibold text-slate-800">
                Sessioni di lettura
              </span>
              <span
                className={`transition-transform ${isReadingSessionsOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            <button
              className="text-indigo-600 font-semibold px-3"
              onClick={() => setIsAddReadingSessionFormOpen(true)}
            >
              Aggiungi +
            </button>
          </div>

          {isReadingSessionsOpen && (
            <div className="border-t border-slate-100 p-4">
              <ReadingSessionsList
                readingSessions={readingSessions}
                loading={readingSessionsLoading}
                error={readingSessionsError}
                onDeleteReadingSession={handleDeleteReadingSession}
                onEditReadingSession={handleEditReadingSessionClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* form considerazioni */}
      {isAddConsiderationFormOpen && (
        <AddConsiderationModal
          bookId={id}
          onClose={handleCloseConsiderationModal}
          consideration={editingConsideration}
          onConsiderationSaved={(savedConsideration) => {
            setConsiderations([
              ...considerations.filter((c) => c.id !== savedConsideration.id),
              savedConsideration,
            ]);
            handleCloseConsiderationModal();
          }}
        />
      )}

      {/* form quote */}
      {isAddQuoteFormOpen && (
        <AddQuoteModal
          bookId={id}
          quote={editingQuote}
          onClose={handleCloseQuoteModal}
          onQuoteSaved={(savedQuote) => {
            setQuotes([
              ...quotes.filter((q) => q.id !== savedQuote.id),
              savedQuote,
            ]);
            handleCloseQuoteModal();
          }}
        />
      )}

      {/* form sessioni di lettura */}
      {isAddReadingSessionFormOpen && (
        <AddReadingSessionModal
          bookId={id}
          readingSession={editingReadingSession}
          onClose={handleCloseReadingSessionModal}
          onReadingSessionSaved={(savedReadingSession) => {
            setReadingSessions([
              ...readingSessions.filter(
                (rs) => rs.id !== savedReadingSession.id,
              ),
              savedReadingSession,
            ]);
            handleCloseReadingSessionModal();
          }}
        />
      )}
    </div>
  );
}

export default BookDetail;
