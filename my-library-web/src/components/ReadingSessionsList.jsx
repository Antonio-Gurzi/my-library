import { formatDate } from "../utils/formatDate";

function ReadingSessionsList({ readingSessions, loading, error, onEditReadingSession, onDeleteReadingSession }) {
  if (loading) return <p className="text-amber-700">Caricamento...</p>;
  if (error) return <p className="text-red-700">Errore: {error}</p>;

  return (
    <div>
      {readingSessions.length === 0 ? (
        <p className="text-amber-700">Nessuna sessione di lettura iniziata.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {readingSessions.map((readingSession) => (
            <div
              key={readingSession.id}
              className="bg-amber-100 border border-amber-600 rounded-md p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center">
                <p className="text-stone-800 font-semibold">
                  {formatDate(readingSession.date)} -
                </p>
                <span className="text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  Fino a pagina {readingSession.current_page}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onEditReadingSession(readingSession)}
                  className="text-amber-700 hover:text-amber-900 text-sm font-semibold px-3"
                >
                  Modifica
                </button>
                <button
                  onClick={() => onDeleteReadingSession(readingSession.id)}
                  className="text-red-700 hover:text-red-800 text-sm font-semibold px-3"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReadingSessionsList;