<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

// use Illuminate\Http\Request;

class UserStatController extends Controller
{

    public function stats()
    {
        return response()->json([
            'books_read' => $this->calculateBooksRead(),
            'books_in_progress' => $this->calculateBooksInProgress(),
            'total_pages_read' => $this->calculateTotalPagesRead(),
            'average_books_per_month' => $this->calculateAverageBooksPerMonth(),
            'most_read_author' => $this->calculateMostReadAuthor(),
            'name' => Auth::user()->name,
        ]);
    }

    private function calculateBooksRead()
    {

        return Auth::user()->books()->whereNotNull('end_date')->count();
    }


    private function calculateBooksInProgress()
    {
        return Auth::user()->books()->whereNull('end_date')->count();
    }


    private function calculateTotalPagesRead()
    {
        $totalPagesRead = 0;
        // prendo tutti i libri dell'utente e ciclo con un foreach,se il valore di end_date è diverso da null allora sommo il valore di total_pages alla variabile di appoggio $totalPagesread , altrimenti prendo le sessioni di lettura del libro per data  decrescente e prendo l ultima sessione e sommo current_page alla variabile di appoggio
        $books = Auth::user()->books;

        foreach ($books as $book) {
            if ($book->end_date !== null) {
                $totalPagesRead += $book->total_pages;
            } else {
                // FIX: 'date' è una colonna di tipo date (solo giorno, senza ora), quindi due
                // sessioni create nello stesso giorno avevano un valore identico e l'ordinamento
                // era ambiguo (bug scoperto da Antonio: il conteggio restava fermo al valore
                // della prima sessione del giorno invece di prendere l'ultima registrata).
                // Aggiungo 'created_at' come criterio secondario per rompere il pareggio.
                $lastSession = $book->readingSessions()
                    ->orderBy('date', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->first();

                if ($lastSession) {
                    $totalPagesRead += $lastSession->current_page;
                }
            }
        }

        return $totalPagesRead;
    }


    private function calculateAverageBooksPerMonth()
    {
        // prendo l anno e il mese corrente
        $currentYear = now()->year;
        $currentMonth = now()->month;
        // annido la query ,voglio i libri dove end_date è diverso da null e in più dove l anno combacia con l anno corrente
        $booksCompletedThisYear = Auth::user()->books()
            ->whereNotNull('end_date')
            ->whereYear('end_date', $currentYear)
            ->count();

        // ritorno il numero di libri completati diviso per il mese corrente,con round arrotondo due cifre decimali
        return round($booksCompletedThisYear / $currentMonth, 2);
    }

    private function calculateMostReadAuthor()
    {
        $mostReadAuthor = Auth::user()->books()
            // prendo il valore di author dove end_date è diverso da null
            ->whereNotNull('end_date')
            ->select('author')
            // raggruppo per autore
            ->groupBy('author')
            // connto il numero di libri letti per autore
            ->selectRaw('count(*) as total')
            // ordino per numero di libri letti in modo decrescente e prendo il primo
            ->orderByDesc('total')
            ->first();
        // se non esiste un autore più letto ritorno null
        return $mostReadAuthor ? $mostReadAuthor->author : null;
    }
}
