<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Models\Book;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return Auth::user()->books;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request)
    {
        // i dati arrivano già validati automaticamente da StoreBookRequest,
        // prima ancora che questo metodo venga eseguito
        $validatedData = $request->validated();

        // creo il libro tramite la relazione Auth::user()->books():
        // questo imposta automaticamente user_id in modo sicuro,
        // senza doverlo scrivere manualmente e senza rischiare che il client lo manipoli
        $newBook = Auth::user()->books()->create($validatedData);

        return response()->json(['message' => 'Nuovo libro inserito con successo', 'book' => $newBook], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare questo libro'], 403);
        }
        return response()->json($book, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per modificare questo libro'], 403);
        }
        $validatedData = $request->validated();

        $book->update($validatedData);
        return response()->json(['message' => 'Libro aggiornato con successo', 'book' => $book], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per eliminare questo libro'], 403);
        }

        $book->delete();

        return response()->json(['message' => 'Libro eliminato con successo'], 200);
    }
}
