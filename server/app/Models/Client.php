<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = ["name","token","domain"];
    
    public function categories(){
        return $this->hasMany(Category::class,"client_id")->orderBy("name","ASC");
    }
}
