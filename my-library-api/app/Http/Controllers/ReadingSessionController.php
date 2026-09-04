<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReadingSessionRequest;
use App\Http\Requests\UpdateReadingSessionRequest;
use App\Models\Book;
use App\Models\ReadingSession;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReadingSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Book $book)
    {
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le sessioni di questo libro'], 403);
        }

        return response()->json($book->readingSessions, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Book $book, StoreReadingSessionRequest $request)
    {
        // controllo che la sessione deve appartenere davvero al libro passato nell'URL
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le sessioni di questo libro'], 403);
        }

        // eseguo la validazione dei dati di input
        $validatedData = $request->validated();

        //creo una nuova sessione di lettura nel DB con i dati validati
        $newReadingSession = $book->readingSessions()->create($validatedData);

        return response()->json(['message' => 'Nuova sessione inserita con successo', 'reading_session' => $newReadingSession], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book, ReadingSession $readingSession)
    {
        // controllo che la sessione deve appartenere davvero al libro passato nell'URL

        if ($readingSession->book_id !== $book->id) {
            return response()->json(['message' => 'Sessione di lettura non trovata per questo libro'], 404);
        }

        // controllo che il libro deve appartenere all'utente autenticato
        $this->authorize('view', $readingSession);

        return response()->json($readingSession, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Book $book, ReadingSession $readingSession, UpdateReadingSessionRequest $request)
    {
        // controllo che la sessione deve appartenere davvero al libro passato nell'URL

        if ($readingSession->book_id !== $book->id) {
            return response()->json(['message' => 'Sessione di lettura non trovata per questo libro'], 404);
        }

        // controllo che il libro deve appartenere all'utente autenticato
        $this->authorize('update', $readingSession);

        // eseguo la validazione dei dati di input
        $validatedData = $request->validated();

        //aggiorno la sessione di lettura nel DB con dati validati

        $readingSession->update($validatedData);

        return response()->json(['message' => 'Sessione di lettura aggiornata con successo', 'reading_session' => $readingSession], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book, ReadingSession $readingSession)
    {
        // controllo che la sessione deve appartenere davvero al libro passato nell'URL

        if ($readingSession->book_id !== $book->id) {
            return response()->json(['message' => 'Sessione di lettura non trovata per questo libro'], 404);
        }

        // controllo che il libro deve appartenere all'utente autenticato
        $this->authorize('delete', $readingSession);

        $readingSession->delete();

        return response()->json(['message' => 'Sessione di lettura eliminata con successo'], 200);
    }
}
