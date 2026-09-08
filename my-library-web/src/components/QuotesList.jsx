function QuotesList({ quotes, loading, error, onEditQuote, onDeleteQuote }) {
  if (loading) return <p className="text-amber-700">Caricamento...</p>;
  if (error) return <p className="text-red-700">Errore: {error}</p>;

  return (
    <div>
      {quotes.length === 0 ? (
        <p className="text-amber-700">Nessuna citazione inserita.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-amber-100 border border-amber-600 rounded-md p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-stone-800 italic leading-relaxed break-words">
                  "{quote.content}"
                </p>
                <span className="self-end mt-2 bg-amber-200 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Pagina {quote.page}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onEditQuote(quote)}
                  className="text-amber-700 hover:text-amber-900 text-sm font-semibold px-3"
                >
                  Modifica
                </button>
                <button
                  onClick={() => onDeleteQuote(quote.id)}
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

export default QuotesList;