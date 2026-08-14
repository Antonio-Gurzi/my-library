import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  // stats parte null,quando monto il componente non ha nessun dato da server
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [booksError, setBooksError] = useState(null);
  const [booksLoading, setBooksLoading] = useState(true);

  const handleBookSaved = (newBook) => {
    setBooks([...books, newBook]);
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
      {isModalOpen && (
        <BookFormModal
          book={null}
          onClose={handleCloseModal}
          onBookSaved={handleBookSaved}
        />
      )}
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
        <h2 className="text-xl font-bold text-slate-800 mb-4">I tuoi libri</h2>

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
              <Link key={book.id} to={`/books/${book.id}`}>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="font-semibold text-slate-800">{book.title}</p>
                  <p className="text-sm text-slate-500">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
