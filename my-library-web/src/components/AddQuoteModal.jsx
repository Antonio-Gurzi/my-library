import { useState, useEffect } from "react";
import api from "../services/api";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {quote ? "Modifica citazione" : "Nuova citazione"}
        </h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={quoteData.content}
            onChange={(e) =>
              setQuoteData({ ...quoteData, content: e.target.value })
            }
            className="w-full border p-2 mb-3"
            placeholder="Testo della citazione"
          />

          <input
            type="number"
            value={quoteData.page}
            onChange={(e) =>
              setQuoteData({ ...quoteData, page: e.target.value })
            }
            className="w-full border p-2 mb-3"
            placeholder="Pagina"
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={loading}>
              Annulla
            </button>
            <button type="submit" disabled={loading}>
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddQuoteModal;
