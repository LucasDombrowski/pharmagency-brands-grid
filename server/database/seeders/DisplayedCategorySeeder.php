<?php

namespace Database\Seeders;

use App\Models\DisplayedCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DisplayedCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            "Anti-moustique / Anti-poux",
            "Aromathérapie",
            "Autres",
            "CBD",
            "Compléments alimentaires",
            "Contactologie",
            "Contention",
            "Coutellerie",
            "Diabète",
            "Diététique",
            "Dénutrition",
            "Dermocosmétique",
            "Fleurs de Bach",
            "Herboristerie",
            "Homéopathie",
            "Hygiène bucco-dentaire",
            "Hygiène féminine",
            "Hygiène intime",
            "Incontinence",
            "Lunettes / loupes",
            "Maquillage",
            "Matériel médical",
            "Médecine naturelle",
            "Médication familiale",
            "Minéraux et vitamines",
            "Nutrition infantile",
            "Oncologie",
            "Orthopédie",
            "Parapharmacie",
            "Parfumerie",
            "Phytothérapie",
            "Premiers soins",
            "Produits bébés",
            "Produits bio",
            "Produits cosmétiques",
            "Produits dentaires",
            "Produits naturels",
            "Produits solaires",
            "Produits vétérinaires",
            "Prothèses capillaires",
            "Prothèses mammaires",
            "Soins capillaires",
            "Soins des pieds",
            "Soins de la peau",
            "Soins du visage",
            "Soins homme",
            "Tabagisme",
            "Thés / Tisanes",
            "Voyages",
            "Zéro déchet",
        ];
        foreach($categories as $category){
            DisplayedCategory::create([
                "name"=>$category
            ]);
        }
    }
}
