<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $fillable = [
        'content',
        'page',
        'book_id',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
