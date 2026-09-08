function ConsiderationsList({
  considerations,
  loading,
  error,
  onDeleteConsideration,
  onEditConsideration,
}) {
  if (loading) return <p className="text-amber-700">Caricamento...</p>;
  if (error) return <p className="text-red-700">Errore: {error}</p>;

  return (
    <div>
      {considerations.length === 0 ? (
        <p className="text-amber-700">Nessuna considerazione inserita.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {considerations.map((consideration) => (
            <div
              key={consideration.id}
              className="bg-amber-100 border border-amber-700 rounded-md p-3 gap-2 flex-row items-center justify-between"
            >
              <p className="text-stone-800">{consideration.note}</p>

              <div className="flex items-center gap-3 shrink-0 mt-2.5">
                <button
                  onClick={() => onEditConsideration(consideration)}
                  className="text-amber-700 hover:text-amber-900 text-sm font-semibold px-3"
                >
                  Modifica
                </button>
                <button
                  onClick={() => onDeleteConsideration(consideration.id)}
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

export default ConsiderationsList;