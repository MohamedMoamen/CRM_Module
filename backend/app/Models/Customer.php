<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable=['name','email','phone','company','address','status','assigned_to','lead_id'];

     public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function lead()
    {
    return $this->belongsTo(Lead::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

     public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

     public function communications()
    {
        return $this->hasMany(Communication::class);
    }

}