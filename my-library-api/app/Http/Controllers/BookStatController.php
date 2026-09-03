<?php

namespace App\Http\Controllers;

use App\Models\Book;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookStatController extends Controller
{
    public function stats(Book $book)
    {
        // controllo di autorizzazione

        if ($book->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Non hai i permessi per visualizzare le statistiche di questo libro'], 403);
        }

        return response()->json([
            'completion_percentage' => $this->calculateCompletionPercentage($book),
            'pages_per_session' => $this->calculatePagesPerSession($book),
            'reading_days' => $this->calculateReadingDays($book),
            'total_reading_time_days' => $this->calculateTotalReadingTime($book),
        ]);
    }

    private function calculateCompletionPercentage(Book $book)
    {
        // prendo l'ultima sessione ordinata per data di lettura decrescente
        // FIX: 'date' è una colonna di tipo date (solo giorno, senza ora), quindi due sessioni
        // create nello stesso giorno avrebbero un valore identico e l'ordinamento sarebbe ambiguo.
        // Aggiungo 'created_at' come criterio secondario per rompere il pareggio in modo affidabile.
        $lastSession = $book->readingSessions()
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();
        // se non ci sono sessioni di lettura mi ritorni 0
        if (!$lastSession) {
            return 0;
        }
        // calcolo la percentuale di completamento del libro:
        //(pagine lette / pagine totali) * 100 -> round per arrotontare a 2 decimali
        return round(($lastSession->current_page / $book->total_pages) * 100, 2);
    }

    private function calculatePagesPerSession(Book $book)
    {
        // recupero tutte le sessioni di lettura del libro più vecchia alla più recente
        // FIX: stesso motivo di sopra. L'ordine relativo tra due sessioni con la stessa 'date'
        // non era garantito, e questo calcolo dipende dall'ordine cronologico corretto.
        $sessions = $book->readingSessions()
            ->orderBy('date', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();
        // creo un array per memorizzare il numero di pagine lette per ogni sessione
        $pagesPerSession = [];
        // creo una variabile per tenere conto della pagina precedente,la prima sessione sarà 0
        $previousPage = 0;

        // per ogni sessione calcolo le pagine lette sottraendo la pagina corrente dalla pagina precedente,il risultato lo pusho nell array e aggiorno previoousPage con la pagina corrente
        foreach ($sessions as $session) {
            $pagesRead = $session->current_page - $previousPage;
            $pagesPerSession[] = $pagesRead;
            $previousPage = $session->current_page;
        }

        // ritorno un array dove ogni elemento rappresenta il numero di pagine lette in ogni sessione di lettura
        return $pagesPerSession;
    }

    private function calculateReadingDays(Book $book)
    {
        return $book->readingSessions()->count();
    }

    private function calculateTotalReadingTime(Book $book)
    {
        // se end_date è null allora usa la data di oggi come data di fine,altrimenti usa end_date
        $endDate = $book->end_date ?? now();

        // calcolo la differenza dei giorni tra la data di inizio e fine
        return (int) floor($book->start_date->diffInDays($endDate));
    }
}
