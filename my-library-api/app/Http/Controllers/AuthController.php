<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // eseguo la validazione dei dati di input
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        // creo un nuovo utente nel DB con i dati validati
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => $validatedData['password'],
        ]);

        // restituisco una risposta JSON con messaggio di successo con i dati dell utente creato

        return response()->json(['message' => 'Utente registrato con  successo', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        // validazione dei dati di input
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        // con i dati validati cerco l utente nel DB traite email
        $user = User::where('email', $credentials['email'])->first();
        // se l utente non esiste o la password non corrisponde restituisco un messaggio di errore
        // Hash::check() è un metodo che confronta la password in chiaro hashata nel DB per verificare se corrisponde
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Credenziali non valide'], 401);
        }
        // genero un token di accesso
        $token = $user->createToken('auth-token')->plainTextToken;
        // se le credenziali sono corrett restituisco un messaggio di successo e il token
        return response()->json(['message' => 'Login effettuato con successo', 'token' => $token], 200);
    }
}
