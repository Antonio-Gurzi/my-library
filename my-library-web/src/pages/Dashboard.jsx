import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import BookFormModal from "../components/BookFormModal";
import { capitalizeWords } from "../utils/formatAuthorName";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [booksError, setBooksError] = useState(null);
  const [booksLoading, setBooksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleOpenModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBookSaved = (newBook) => {
    setBooks([...books.filter((book) => book.id !== newBook.id), newBook]);
    fetchStats();
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (bookId) => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questo libro?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/books/${bookId}`);
      setBooks(books.filter((book) => book.id !== bookId));
      fetchStats();
    } catch (err) {
      setBooksError(
        err.response?.data?.message ?? "Errore durante l'eliminazione.",
      );
    }
  };

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get("/user/stats");
      setStats(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Errore di connessione, riprova.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        setBooks(response.data);
      } catch (err) {
        setBooksError(
          err.response?.data?.message ?? "Errore di connessione, riprova.",
        );
      } finally {
        setBooksLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
        <p className="text-amber-300">Caricamento statistiche...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 px-4 py-6 sm:py-10">
      <div className="max-w-3xl lg:max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-200 mb-6 text-center">
          Benvenuto {stats.name}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-amber-100 border border-amber-700 border-l-4 border-l-amber-600 rounded-lg shadow-md p-4">
            <p className="text-xs text-center uppercase tracking-wide text-amber-900 font-bold">
              Libri letti
            </p>
            <p className="text-lg text-amber-800 text-center">
              {stats.books_read}
            </p>
          </div>
          <div className="bg-amber-100 border border-amber-700 border-l-4 border-l-amber-600 rounded-lg shadow-md p-4">
            <p className="text-xs text-center uppercase tracking-wide text-amber-900 font-bold">
              Libri in corso
            </p>
            <p className="text-lg text-amber-800 text-center">
              {stats.books_in_progress}
            </p>
          </div>
          <div className="bg-amber-100 border border-amber-700 border-l-4 border-l-amber-600 rounded-lg shadow-md p-4">
            <p className="text-xs text-center uppercase tracking-wide text-amber-900 font-bold">
              Pagine totali lette
            </p>
            <p className="text-lg text-amber-800 text-center">
              {stats.total_pages_read}
            </p>
          </div>
          <div className="bg-amber-100 border border-amber-700 border-l-4 border-l-amber-600 rounded-lg shadow-md p-4">
            <p className="text-xs text-center uppercase tracking-wide text-amber-900 font-bold">
              Media libri al mese
            </p>
            <p className="text-lg text-amber-800 text-center">
              {stats.average_books_per_month}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 bg-amber-100 border border-amber-700 border-l-4 border-l-amber-600 rounded-lg shadow-md p-4">
            <p className="text-xs text-center uppercase tracking-wide text-amber-900 font-bold">
              Autore più letto
            </p>
            <p className="text-md text-center text-amber-800">
              {capitalizeWords(stats.most_read_author)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl lg:max-w-5xl mx-auto mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-200">I tuoi libri</h2>
          <button
            onClick={handleOpenModal}
            className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-amber-50 text-sm font-semibold px-4 py-2.5 sm:py-2 rounded-md transition"
          >
            Aggiungi libro
          </button>
        </div>

        {booksLoading ? (
          <p className="text-amber-300">Caricamento libri...</p>
        ) : booksError ? (
          <p className="text-red-200">Errore: {booksError}</p>
        ) : books.length === 0 ? (
          <p className="text-amber-300">
            Non hai ancora aggiunto nessun libro.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-amber-100 border border-amber-700 rounded-lg shadow-md p-4 flex flex-col justify-between gap-3 h-full transition hover:shadow-lg hover:-translate-y-0.5"
              >
                <Link
                  to={`/books/${book.id}`}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 w-10 h-10 rounded-md bg-amber-700 text-amber-50 flex items-center justify-center font-bold">
                    {book.title.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800 line-clamp-2">
                      {book.title.charAt(0).toUpperCase() + book.title.slice(1)}
                    </p>
                    <p className="text-sm text-stone-600 text-center">{capitalizeWords(book.author)}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-3 border-t border-amber-300 pt-3 justify-center">
                  <button
                    onClick={() => handleEditClick(book)}
                    className="text-amber-700 hover:text-amber-900 text-sm font-semibold px-3"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDeleteClick(book.id)}
                    className="text-red-700 hover:text-red-800 text-sm font-semibold px-3"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <BookFormModal
          book={editingBook}
          onClose={handleCloseModal}
          onBookSaved={handleBookSaved}
        />
      )}
    </div>
  );
}

export default Dashboard;