<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for($i=0;$i<20;$i++){
            $category = Category::factory()->count(1)->create()[0];
            for($j=0;$j<5;$j++){
                $brand = Brand::inRandomOrder()->first();
                $category->brands()->attach($brand);
            }
        }
    }
}
