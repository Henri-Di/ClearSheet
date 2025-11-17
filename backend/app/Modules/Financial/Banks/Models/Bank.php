<?php

namespace App\Modules\Financial\Banks\Models;

use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    protected $table = 'banks';

    protected $fillable = [
        'name'
    ];
}
