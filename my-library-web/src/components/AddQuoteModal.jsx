import { useState, useEffect } from "react";
import api from "../services/api";
import FormInput from "./FormInput";

function AddQuoteModal({ quote, bookId, onClose, onQuoteSaved }) {
  const [quoteData, setQuoteData] = useState({ content: "", page: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setQuoteData({
      content: quote ? quote.content : "",
      page: quote ? quote.page : "",
    });
  }, [quote]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...quoteData, page: Number(quoteData.page) };

      let response;
      if (quote) {
        response = await api.put(
          `/books/${bookId}/quotes/${quote.id}`,
          payload,
        );
      } else {
        response = await api.post(`/books/${bookId}/quotes`, payload);
      }

      const savedQuote = response.data.quote;
      onQuoteSaved(savedQuote);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message ?? "Errore nel salvataggio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-amber-100 border border-amber-700 rounded-xl shadow-md p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4">
          {quote ? "Modifica citazione" : "Nuova citazione"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={quoteData.content}
            onChange={(e) =>
              setQuoteData({ ...quoteData, content: e.target.value })
            }
            className="w-full border border-amber-700 rounded-md p-2 bg-amber-50 text-stone-800 placeholder:text-stone-500 resize-none focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="Testo della citazione"
          />

          <FormInput
            type="number"
            name="page"
            placeholder="Pagina"
            value={quoteData.page}
            onChange={(e) =>
              setQuoteData({ ...quoteData, page: e.target.value })
            }
          />

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-amber-700 hover:text-amber-900 font-semibold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-amber-700 hover:text-amber-900 font-semibold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuoteModal;
