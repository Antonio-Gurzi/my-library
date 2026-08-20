import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import BookFormModal from "../components/BookFormModal";

function Dashboard() {
  // stats parte null,quando monto il componente non ha nessun dato da server
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [booksError, setBooksError] = useState(null);
  const [booksLoading, setBooksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // funzioni per aprire e chiudere le modali
  const handleOpenModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // funzione per aggiorare la lista dei libri
  const handleBookSaved = (newBook) => {
    setBooks([...books, newBook]);
  };

  // funzione per aprire la modale in edit mode

  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  // funzione per eliminare un libro
  const handleDeleteClick = async (bookId) => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questo libro?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/books/${bookId}`);
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (err) {
      setBooksError(
        err.response?.data?.message ?? "Errore durante l'eliminazione.",
      );
    }
  };

  // loading parte da true perchè aspetto che i dati mi arrivino dal backend(quindi appena il componente è montato appare il loading)
  const [loading, setLoading] = useState(true);
  // il primo useEffetc che mi serve per le statistiche
  useEffect(() => {
    // richiesta GET alle statistiche utente
    const fetchStats = async () => {
      try {
        // l'interceptor di api.js allega automaticamente il Bearer token
        const response = await api.get("/user/stats");

        // salviamo l'intero oggetto ricevuto dal backend
        setStats(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ?? "Errore di connessione, riprova.",
        );
      } finally {
        setLoading(false);
      }
    };

    // chiamiamo subito la funzione appena definita
    fetchStats();
  }, []);

  // il secondo useEffect che mi serve per la lista dei libri dell utente
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

  // finché stiamo aspettando la risposta, mostriamo un messaggio semplice
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Caricamento statistiche...</p>
      </div>
    );
  }

  // se qualcosa è andato storto, mostriamo l'errore
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-600">Errore: {error}</p>
      </div>
    );
  }

  // solo in caso i dati arrivino dal backend ,allora li mostro
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Benvenuto {stats.name}
        </h1>
        {/* statistiche libri */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-slate-500">Libri letti</p>
            <p className="text-xl font-semibold text-slate-800">
              {stats.books_read}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-slate-500">Libri in corso</p>
            <p className="text-xl font-semibold text-slate-800">
              {stats.books_in_progress}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-slate-500">Pagine totali lette</p>
            <p className="text-xl font-semibold text-slate-800">
              {stats.total_pages_read}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-slate-500">Media libri al mese</p>
            <p className="text-xl font-semibold text-slate-800">
              {stats.average_books_per_month}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-slate-500">Autore più letto</p>
            <p className="text-xl font-semibold text-slate-800">
              {stats.most_read_author}
            </p>
          </div>
        </div>
      </div>

      {/* lista libri */}
      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">I tuoi libri</h2>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
          >
            Aggiungi libro
          </button>
        </div>

        {booksLoading ? (
          <p className="text-slate-500">Caricamento libri...</p>
        ) : booksError ? (
          <p className="text-red-600">Errore: {booksError}</p>
        ) : books.length === 0 ? (
          <p className="text-slate-500">
            Non hai ancora aggiunto nessun libro.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
              >
                <Link to={`/books/${book.id}`} className="flex-1">
                  <p className="font-semibold text-slate-800">{book.title}</p>
                  <p className="text-sm text-slate-500">{book.author}</p>
                </Link>

                <button
                  onClick={() => handleEditClick(book)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold px-3"
                >
                  Modifica
                </button>

                <button
                  onClick={() => handleDeleteClick(book.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold px-3"
                >
                  Elimina
                </button>
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
