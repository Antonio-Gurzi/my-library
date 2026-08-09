<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consideration extends Model
{
    protected $fillable = [
        'note',
        'book_id',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
