function ConsiderationsList({
  considerations,
  loading,
  error,
  onDeleteConsideration,
  onEditConsideration,
}) {
  if (loading) return <p className="text-slate-500">Caricamento...</p>;
  if (error) return <p className="text-red-600">Errore: {error}</p>;

  return (
    <div>
      {considerations.length === 0 ? (
        <p className="text-slate-500">Nessuna considerazione inserita.</p>
      ) : (
        <ul className="list-disc pl-5">
          {considerations.map((consideration) => (
            <li key={consideration.id} className="text-slate-700">
              {consideration.note}
              <button
                onClick={() => onEditConsideration(consideration)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold px-3"
              >
                Modifica
              </button>
              <button
                onClick={() => onDeleteConsideration(consideration.id)}
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

export default ConsiderationsList;
