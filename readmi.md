# 📚 my-library

**Reading tracker full-stack** — un'applicazione web per tenere traccia dei libri letti, delle citazioni preferite, delle considerazioni personali e delle sessioni di lettura, con statistiche calcolate in autonomia.

Autenticazione sicura, autorizzazione centralizzata, validazione separata per creazione/modifica, e un frontend disaccoppiato che consuma un'API REST propria.

---

## 🧱 Stack tecnico

**Backend — `my-library-api`**
- Laravel 13
- Laravel Sanctum (autenticazione via token)
- MySQL
- Eloquent ORM, Form Request dedicate per ogni risorsa (Store/Update separate)
- Laravel Policy per l'autorizzazione centralizzata

**Frontend — `my-library-web`**
- React 19
- React Router 7
- Axios (istanza centralizzata con interceptor per il Bearer token)
- Tailwind CSS 4
- Vite

---

## ✨ Funzionalità principali

- **Autenticazione completa**: registrazione, login, logout (con revoca del singolo token via Sanctum)
- **Gestione libri**: creazione, modifica, eliminazione, stato "in corso"/"terminato"
- **Per ogni libro**: citazioni preferite, considerazioni personali, sessioni di lettura con pagina raggiunta e data
- **Statistiche automatiche**: percentuale di completamento, pagine lette per sessione, giorni di lettura, tempo totale di lettura, autore più letto, media libri al mese
- **Autorizzazione a livello di risorsa**: ogni utente accede solo ai propri dati, verificato tramite Policy dedicate (non solo controlli manuali sparsi nei controller)
- **Interfaccia interamente responsive**, progettata mobile-first

---

## 🗂️ Struttura del repository

Monorepo con due applicazioni indipendenti che comunicano via REST API:

```
my-library/
├── my-library-api/      → Backend Laravel (REST API)
└── my-library-web/      → Frontend React (SPA)
```

---

## 🚀 Avvio in locale

**Backend**
```bash
cd my-library-api
composer install
cp .env.example .env
php artisan key:generate
# configura le credenziali del database MySQL nel file .env
php artisan migrate
php artisan serve
```

**Frontend**
```bash
cd my-library-web
npm install
npm run dev
```

L'app frontend si aspetta l'API disponibile su `http://127.0.0.1:8000/api`.

---

## 👤 Autore

**Antonio Gurzì** — Junior Full Stack Web Developer

- GitHub: [github.com/Antonio-Gurzi](https://github.com/Antonio-Gurzi)
- LinkedIn: [linkedin.com/in/antonio-gurzì-fullstackdeveloper](https://www.linkedin.com/in/antonio-gurz%C3%AC-fullstackdeveloper/)