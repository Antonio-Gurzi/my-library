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
          <FormInput
            type="text"
            name="title"
            placeholder="Scrivi il titolo del libro"
            value={formData.title}
            onChange={handleChange}
          />

          <FormInput
            type="text"
            name="author"
            placeholder="Scrivi l'autore del libro"
            value={formData.author}
            onChange={handleChange}
          />

          <FormInput
            type="number"
            name="total_pages"
            placeholder="Scrivi le pagine totali del libro"
            value={formData.total_pages}
            onChange={handleChange}
          />

          <FormInput
            type="date"
            name="start_date"
            placeholder="Scrivi quando hai iniziato a leggere il libro"
            value={formData.start_date}
            onChange={handleChange}
          />

          <FormInput
            type="date"
            name="end_date"
            placeholder="Scrivi quando hai terminato il libro"
            value={formData.end_date}
            onChange={handleChange}
          />
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;
