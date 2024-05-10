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

     public function __construct(Client $client){
        $this->client = $client;
     }  

    public $client;

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if($this->client->categories->where("name",$value)->first() instanceof Category){
            $fail("The client is already associated with this category");
        }
    }
}
