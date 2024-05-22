<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Client;
use Dirape\Token\Token;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (($open = fopen(__DIR__."/../data/all_clients.csv", "r")) !== false) {
            $first = fgetcsv($open, null, ",");
            while (($data = fgetcsv($open, null, ";")) !== false) {
                Client::create([
                    "name"=>$data[2],
                    "domain"=>$data[3],
                    "token"=>(new Token())->Unique('clients', 'token', 16)
                ]);
            }
            fclose($open);
        }
    }
}
