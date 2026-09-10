import { useState, useEffect } from "react";
import api from "../services/api";
import FormInput from "./FormInput";

function AddReadingSessionModal({
  readingSession,
  bookId,
  onClose,
  onReadingSessionSaved,
}) {
  const [sessionData, setSessionData] = useState({
    date: "",
    current_page: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSessionData({
      date: readingSession ? readingSession.date : "",
      current_page: readingSession ? readingSession.current_page : "",
    });
  }, [readingSession]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...sessionData,
        current_page: Number(sessionData.current_page),
      };

      let response;
      if (readingSession) {
        response = await api.put(
          `/books/${bookId}/reading-sessions/${readingSession.id}`,
          payload,
        );
      } else {
        response = await api.post(
          `/books/${bookId}/reading-sessions`,
          payload,
        );
      }

      const savedReadingSession = response.data.reading_session;
      onReadingSessionSaved(savedReadingSession);
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
          {readingSession
            ? "Modifica sessione di lettura"
            : "Nuova sessione di lettura"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput
            type="date"
            name="date"
            value={sessionData.date}
            onChange={(e) =>
              setSessionData({ ...sessionData, date: e.target.value })
            }
          />

          <FormInput
            type="number"
            name="current_page"
            placeholder="Pagina raggiunta"
            value={sessionData.current_page}
            onChange={(e) =>
              setSessionData({ ...sessionData, current_page: e.target.value })
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
              className="bg-amber-700 text-amber-50 font-semibold px-4 py-2 rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReadingSessionModal;