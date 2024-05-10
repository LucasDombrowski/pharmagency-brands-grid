<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class BrandValidator implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        $validator = validator($value,[
            "name"=>"required|string",
            "url"=>"required|url"
        ]);

        if($validator->fails()){
            $fail("Invalidate brands field");
        } 
    }


}
