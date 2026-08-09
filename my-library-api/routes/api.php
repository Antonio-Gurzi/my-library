<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookStatController;
use App\Http\Controllers\ConsiderationController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\ReadingSessionController;
use App\Http\Controllers\UserStatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// autenticazione con sanctum
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// rotte libri
Route::apiResource('books', BookController::class)->middleware('auth:sanctum');

// registrazione utente
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// rotte per le sessioni di lettura
Route::apiResource('books.reading-sessions', ReadingSessionController::class)
    ->middleware('auth:sanctum');


// rotte per le citazioni
Route::apiResource('books.quotes', QuoteController::class)
    ->middleware('auth:sanctum');

// rotte per le considerazioni
Route::apiResource('books.considerations', ConsiderationController::class)
    ->middleware('auth:sanctum');

// rotte statistiche libro
Route::get('books/{book}/stats', [BookStatController::class, 'stats'])->middleware('auth:sanctum')->name('books.stats');

//  rotte statistiche utente
Route::get('user/stats', [UserStatController::class, 'stats'])->middleware('auth:sanctum')->name('user.stats');
