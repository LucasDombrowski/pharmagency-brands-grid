<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "name"=>"admin",
            "email"=>"admin@data.catalogues-pharmagency.fr",
            "password"=>Hash::make("27Jo~s0eN!?7")
        ]);
    }
}
