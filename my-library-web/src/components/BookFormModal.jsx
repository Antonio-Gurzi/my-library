import { useState } from "react";
import api from "../services/api";
import FormInput from "./FormInput";

function BookFormModal({ book, onClose, onBookSaved }) {
  const [formData, setFormData] = useState(
    // se il libro esiste ,mi riempio il form con i dati del libro (per edit mode)
    book
      ? {
          title: book.title,
          author: book.author,
          total_pages: book.total_pages,
          start_date: book.start_date,
          end_date: book.end_date,
        }
      : // altrimenti mando un libro vuoto in modo da avere i campi vuoti(per inserire un nuovo libro)
        {
          title: "",
          author: "",
          total_pages: 0,
          start_date: "",
          end_date: "",
        },
  );
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
      let response;
      if (book) {
        response = await api.put(`/books/${book.id}`, formData);
      } else {
        response = await api.post("/books", formData);
      }

      onBookSaved(response.data.book);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Errore di connessione, riprova.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {book ? "Modifica libro" : "Aggiungi libro"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* i FormInput per title, author, ecc. li aggiungiamo dopo */}
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;
