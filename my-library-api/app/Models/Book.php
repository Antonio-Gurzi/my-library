<?php

namespace App\Models;

use App\Models\Consideration;
use App\Models\Quote;
use App\Models\ReadingSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'total_pages',
        'start_date',
        'end_date',
        'user_id',
    ];

    public function readingSessions()
    {
        return $this->hasMany(ReadingSession::class);
    }
    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }
    public function considerations()
    {
        return $this->hasMany(Consideration::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // per convertire le date in oggetti Carbon per poter effettuare operazione sulle date
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }
}
