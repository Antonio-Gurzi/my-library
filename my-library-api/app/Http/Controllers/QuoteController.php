<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuoteRequest;
use App\Http\Requests\UpdateQuoteRequest;
use App\Models\Book;
use App\Models\Quote;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Book $book)
    {
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le citazioni di questo libro'], 403);
        }

        return response()->json($book->quotes, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Book $book, StoreQuoteRequest $request)
    {
        // controllo il libro passato nell url appartiene all utente loggato
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le citazioni di questo libro'], 403);
        }

        // eseguo la validazione dei dati di input
        $validatedData = $request->validated();

        //creo una nuova cit nel DB con i dati validati

        $newQuote = $book->quotes()->create($validatedData);

        return response()->json(['message' => 'Nuova citazione inserita con successo', 'quote' => $newQuote], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book, Quote $quote)
    {
        // controllo che la citazione appartenga al libro passato nell url
        if ($quote->book_id !== $book->id) {
            return response()->json(['message' => 'Citazione non trovata per questo libro'], 404);
        }
        // controllo il libro passato nell url appartiene all utente loggato
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le citazioni di questo libro'], 403);
        }


        return response()->json($quote, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Book $book, Quote $quote, UpdateQuoteRequest $request)
    {
        // controllo che la citazione appartenga al libro passato nell url
        if ($quote->book_id !== $book->id) {
            return response()->json(['message' => 'Citazione non trovata per questo libro'], 404);
        }
        // controllo il libro passato nell url appartiene all utente loggato
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le citazioni di questo libro'], 403);
        }

        $validatedData = $request->validated();

        $quote->update($validatedData);

        return response()->json(['message' => 'Citazione aggiornata con successo', 'quote' => $quote], 200);
    }

    public function destroy(Book $book, Quote $quote)
    {
        // controllo che la citazione appartenga al libro passato nell url
        if ($quote->book_id !== $book->id) {
            return response()->json(['message' => 'Citazione non trovata per questo libro'], 404);
        }
        // controllo il libro passato nell url appartiene all utente loggato
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le citazioni di questo libro'], 403);
        }

        $quote->delete();

        return response()->json(['message' => 'Citazione eliminata con successo'], 200);
    }
}
