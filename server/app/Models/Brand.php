<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = ["name","png_url","jpg_url","validated"];

    protected $hidden = ['pivot'];

    public function categories(){
        return $this->belongsToMany(Category::class,"brand_category","brand_id","category_id");
    }

}
