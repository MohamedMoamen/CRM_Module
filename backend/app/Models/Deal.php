<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    protected $fillable=['customer_id','amount','stage','expected_close_date'];


   public function customer() {
    return $this->belongsTo(Customer::class);
   }
   
}
