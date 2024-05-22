<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Brand;
use App\Models\Client;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dir = __DIR__."/../data/brands/";
        $files = scandir($dir);
        $files = array_slice($files,2);
        $url = "https://www.catalogues-pharmagency.fr/wp-content/uploads/marques";
        foreach($files as $file){
            $fileURL = $url."/".$file;
            if(str_contains($file,".png")){
                $fileName = explode(".png",$file)[0];
                if(!Brand::where("name",parseBrandName($fileName))->first() instanceof Brand){
                    Brand::create([
                        "name"=>parseBrandName($fileName),
                        "png_url"=>$fileURL,
                        "validated"=>true
                    ]);
                }
            } else {
                if(str_contains($file,".jpeg")){
                    $fileName = explode(".jpeg",$file)[0];
                } else {
                    $fileName = explode(".jpg",$file)[0];
                }
                if(!Brand::where("name",parseBrandName($fileName))->first() instanceof Brand){
                    Brand::create([
                        "name"=>parseBrandName($fileName),
                        "jpg_url"=>$fileURL,
                        "validated"=>true
                    ]);
                }
            }
        }
    }
}
