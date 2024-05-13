<?php

namespace App\Rules;

use App\Models\Category;
use App\Models\Client;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CheckCategoryName implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */

     public function __construct(Client $client, Category $category = null){
        $this->client = $client;
        $this->category = $category;
     }  

    public $client;
    public $category;

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = $this->client->categories->where("name",$value);
        if($this->category instanceof Category){
            $query = $query->where("id","!=",$this->category->id);
        }
        if($query->first() instanceof Category){
            $fail("The client is already associated with this category");
        }
    }
}
