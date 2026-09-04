<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConsiderationRequest;
use App\Http\Requests\UpdateConsiderationRequest;
use App\Models\Book;
use App\Models\Consideration;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConsiderationController extends Controller
{
    public function index(Book $book)
    {
        // controllo se l utente autenticato è il proprietario del libro
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le considerazioni di questo libro'], 403);
        }

        return response()->json($book->considerations, 200);
    }

    public function store(Book $book, StoreConsiderationRequest $request)
    {
        // controllo se l utente autenticato è il proprietario del libro
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le considerazioni di questo libro'], 403);
        }

        $validatedData = $request->validated();

        $newConsideration = $book->considerations()->create($validatedData);

        return response()->json(['message' => 'Nuova considerazione inserita con successo', 'consideration' => $newConsideration], 201);
    }

    public function show(Book $book, Consideration $consideration)
    {
        // controllo se la considerazione appartiene al libro
        if ($consideration->book_id !== $book->id) {
            return response()->json(['message' => 'Considerazione non trovata per questo libro'], 404);
        }

        // controllo se l utente autenticato è il proprietario del libro
        $this->authorize('view', $consideration);

        return response()->json($consideration, 200);
    }

    public function update(Book $book, Consideration $consideration, UpdateConsiderationRequest $request)
    {
        // controllo se la considerazione appartiene al libro
        if ($consideration->book_id !== $book->id) {
            return response()->json(['message' => 'Considerazione non trovata per questo libro'], 404);
        }

        // controllo se l utente autenticato è il proprietario del libro
        $this->authorize('update', $consideration);

        $validatedData = $request->validated();

        $consideration->update($validatedData);

        return response()->json(['message' => 'Considerazione aggiornata con successo', 'consideration' => $consideration], 200);
    }

    public function destroy(Book $book, Consideration $consideration)
    {
        // controllo se la considerazione appartiene al libro
        if ($consideration->book_id !== $book->id) {
            return response()->json(['message' => 'Considerazione non trovata per questo libro'], 404);
        }

        // controllo se l utente autenticato è il proprietario del libro
        $this->authorize('delete', $consideration);

        $consideration->delete();

        return response()->json(['message' => 'Considerazione eliminata con successo'], 200);
    }
}
