<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
     protected $fillable=['name','email','phone','source','status','assigned_to'];

     public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class);
    }
    
}
