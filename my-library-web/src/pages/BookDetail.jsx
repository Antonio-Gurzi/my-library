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
import { capitalizeWords } from "../utils/formatAuthorName";

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isConsiderationsOpen, setIsConsiderationsOpen] = useState(false);
  const [isAddConsiderationFormOpen, setIsAddConsiderationFormOpen] =
    useState(false);

  const [considerations, setConsiderations] = useState([]);
  const [considerationsLoading, setConsiderationsLoading] = useState(true);
  const [considerationsError, setConsiderationsError] = useState(null);
  const [editingConsideration, setEditingConsideration] = useState(null);

  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);
  const [isAddQuoteFormOpen, setIsAddQuoteFormOpen] = useState(false);

  const [readingSessions, setReadingSessions] = useState([]);
  const [readingSessionsLoading, setReadingSessionsLoading] = useState(true);
  const [readingSessionsError, setReadingSessionsError] = useState(null);
  const [editingReadingSession, setEditingReadingSession] = useState(null);
  const [isReadingSessionsOpen, setIsReadingSessionsOpen] = useState(false);
  const [isAddReadingSessionFormOpen, setIsAddReadingSessionFormOpen] =
    useState(false);

  const handleEditConsiderationClick = (consideration) => {
    setEditingConsideration(consideration);
    setIsAddConsiderationFormOpen(true);
  };
  const handleCloseConsiderationModal = () => {
    setIsAddConsiderationFormOpen(false);
    setEditingConsideration(null);
  };

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

  useEffect(() => {
    fetchConsiderations();
  }, [id]);

  useEffect(() => {
    fetchQuotes();
  }, [id]);

  useEffect(() => {
    fetchReadingSessions();
  }, [id]);

  const handleEditQuoteClick = (quote) => {
    setEditingQuote(quote);
    setIsAddQuoteFormOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsAddQuoteFormOpen(false);
    setEditingQuote(null);
  };

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

  const handleEditReadingSessionClick = (readingSession) => {
    setEditingReadingSession(readingSession);
    setIsAddReadingSessionFormOpen(true);
  };

  const handleCloseReadingSessionModal = () => {
    setIsAddReadingSessionFormOpen(false);
    setEditingReadingSession(null);
  };

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
      fetchStats();
    } catch (err) {
      setReadingSessionsError(
        err.response?.data?.message ?? "Errore durante l'eliminazione.",
      );
    }
  };

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

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

  useEffect(() => {
    fetchStats();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
        <p className="text-amber-300">Caricamento libro...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
        <p className="text-red-200">Errore: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-amber-100 border border-amber-700 rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-stone-800 text-center">{book.title.charAt(0).toUpperCase() + book.title.slice(1)}</h1>
          <p className="text-stone-600 mb-6 text-center italic">di {capitalizeWords(book.author)}</p>

          <div className="flex justify-around text-center">
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-amber-700">
                Pagine totali
              </p>
              <p className="font-semibold text-stone-800">{book.total_pages}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-amber-700">
                Data inizio
              </p>
              <p className="font-semibold text-stone-800">
                {formatDate(book.start_date) ?? "Non ancora iniziato"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold text-amber-700">
                Data fine
              </p>
              <p className="font-semibold text-stone-800">
                {formatDate(book.end_date) ?? "In corso"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12 text-center">
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-amber-700">
                Libro iniziato da
              </p>
              <p className="font-semibold text-stone-800">
                {statsLoading
                  ? "Caricamento..."
                  : statsError
                    ? "Errore"
                    : `${stats.total_reading_time_days} giorni`}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-amber-700">
                Completamento libro
              </p>
              <p className="font-semibold text-stone-800">
                {statsLoading
                  ? "Caricamento..."
                  : statsError
                    ? "Errore"
                    : `${book.end_date ? 100 : stats.completion_percentage  } %`}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-amber-700">
                Pagine per sessione
              </p>
              <p className="font-semibold text-stone-800">
                {statsLoading
                  ? "Caricamento..."
                  : statsError
                    ? "Errore"
                    : stats.pages_per_session?.length
                      ? stats.pages_per_session.slice(-3).reverse().join(", ")
                      : 0}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wide font-semibold text-amber-700">
                Sessioni di lettura
              </p>
              <p className="font-semibold text-stone-800">
                {statsLoading
                  ? "Caricamento..."
                  : statsError
                    ? "Errore"
                    : stats.reading_days}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-100 border border-amber-700 rounded-xl shadow-md mt-4 overflow-hidden">
          <div className="flex items-center justify-between w-full p-4">
            <button
              onClick={() => setIsConsiderationsOpen(!isConsiderationsOpen)}
              className="flex items-center gap-2 flex-1"
            >
              <span className="font-semibold text-stone-800">
                Considerazioni
              </span>
              <span
                className={`text-amber-700 transition-transform ${isConsiderationsOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            <button
              className="text-amber-700 hover:text-amber-900 font-semibold px-3"
              onClick={() => setIsAddConsiderationFormOpen(true)}
            >
              Aggiungi +
            </button>
          </div>

          {isConsiderationsOpen && (
            <div className="border-t border-amber-700 p-4">
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

        <div className="bg-amber-100 border border-amber-700 rounded-xl shadow-md mt-4 overflow-hidden">
          <div className="flex items-center justify-between w-full p-4">
            <button
              onClick={() => setIsQuotesOpen(!isQuotesOpen)}
              className="flex items-center gap-2 flex-1"
            >
              <span className="font-semibold text-stone-800">Citazioni</span>
              <span
                className={`text-amber-700 transition-transform ${isQuotesOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            <button
              className="text-amber-700 hover:text-amber-900 font-semibold px-3"
              onClick={() => setIsAddQuoteFormOpen(true)}
            >
              Aggiungi +
            </button>
          </div>

          {isQuotesOpen && (
            <div className="border-t border-amber-700 p-4">
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

        <div className="bg-amber-100 border border-amber-700 rounded-xl shadow-md mt-4 overflow-hidden">
          <div className="flex items-center justify-between w-full p-4">
            <button
              onClick={() => setIsReadingSessionsOpen(!isReadingSessionsOpen)}
              className="flex items-center gap-2 flex-1"
            >
              <span className="font-semibold text-stone-800">
                Sessioni di lettura
              </span>
              <span
                className={`text-amber-700 transition-transform ${isReadingSessionsOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
            <button
              className="text-amber-700 hover:text-amber-900 font-semibold px-3"
              onClick={() => setIsAddReadingSessionFormOpen(true)}
            >
              Aggiungi +
            </button>
          </div>

          {isReadingSessionsOpen && (
            <div className="border-t border-amber-700 p-4">
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
            fetchStats();
          }}
        />
      )}
    </div>
  );
}

export default BookDetail;
