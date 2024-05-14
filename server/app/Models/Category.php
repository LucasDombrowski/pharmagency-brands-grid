<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $table = "categories";
    public $timestamps = false;

    protected $fillable = ["name","client_id"];

    protected $hidden = ['pivot'];

    public function brands(){
        return $this->belongsToMany(Brand::class,"brand_category","category_id","brand_id");
    }

    public function client(){
        return $this->belongsTo(Client::class,"client_id","id");
    }
}
