import { useState } from "react";
import api from "../services/api";

function AddConsiderationModal({ bookId, onClose, onConsiderationSaved }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post(`/books/${bookId}/considerations`, {
        note,
      });

      onConsiderationSaved(response.data.consideration);
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
          Nuova considerazione
        </h2>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Scrivi la tua considerazione..."
            rows={5}
            className="border border-slate-300 rounded-md p-2 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Salvataggio..." : "Salva"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddConsiderationModal;
