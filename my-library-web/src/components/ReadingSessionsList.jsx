import { formatDate } from "../utils/formatDate";

function ReadingSessionsList({ readingSessions, loading, error, onEditReadingSession, onDeleteReadingSession }) {
  if (loading) return <p className="text-slate-500">Caricamento...</p>;
  if (error) return <p className="text-red-600">Errore: {error}</p>;

  return (
    <div>
      {readingSessions.length === 0 ? (
        <p className="text-slate-500">Nessuna sessione di lettura iniziata.</p>
      ) : (
        <ul className="list-disc pl-5">
          {readingSessions.map((readingSession) => (
            <li key={readingSession.id} className="text-slate-700">
              {formatDate(readingSession.date)} - {readingSession.current_page}
              <button
                onClick={() => onEditReadingSession(readingSession)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold px-3"
              >
                Modifica
              </button>
              <button
                onClick={() => onDeleteReadingSession(readingSession.id)}
                className="text-red-600 hover:text-red-800 text-sm font-semibold px-3"
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReadingSessionsList;
