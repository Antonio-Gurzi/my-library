<?php

namespace App\Models;

use App\Models\Book;
use Illuminate\Database\Eloquent\Model;

class ReadingSession extends Model
{
    protected $fillable = [
        'date',
        'current_page',
        'book_id',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
