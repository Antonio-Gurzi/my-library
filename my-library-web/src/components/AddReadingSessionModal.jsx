import { useState, useEffect } from "react";
import api from "../services/api";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {readingSession
            ? "Modifica sessione di lettura"
            : "Nuova sessione di lettura"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={sessionData.date}
            onChange={(e) =>
              setSessionData({ ...sessionData, date: e.target.value })
            }
            className="w-full border p-2 mb-3"
          />

          <input
            type="number"
            value={sessionData.current_page}
            onChange={(e) =>
              setSessionData({ ...sessionData, current_page: e.target.value })
            }
            className="w-full border p-2 mb-3"
            placeholder="Pagina raggiunta"
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

export default AddReadingSessionModal;