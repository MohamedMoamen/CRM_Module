<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $fillable=['user_id','user_role','action_type','table_name','record_id','old_data','new_data'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
