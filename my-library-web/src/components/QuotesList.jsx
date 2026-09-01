function QuotesList({ quotes, loading, error, onEditQuote, onDeleteQuote }) {
  if (loading) return <p className="text-slate-500">Caricamento...</p>;
  if (error) return <p className="text-red-600">Errore: {error}</p>;

  return (
    <div>
      {quotes.length === 0 ? (
        <p className="text-slate-500">Nessuna citazione inserita.</p>
      ) : (
        <ul className="list-disc pl-5">
          {quotes.map((quote) => (
            <li key={quote.id} className="text-slate-700">
              {quote.content} a pagina {quote.page}
              <button
                onClick={() => onEditQuote(quote)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold px-3"
              >
                Modifica
              </button>
              <button
                onClick={() => onDeleteQuote(quote.id)}
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

export default QuotesList;
