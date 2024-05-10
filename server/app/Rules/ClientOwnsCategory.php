<?php

namespace App\Rules;

use App\Models\Category;
use App\Models\Client;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ClientOwnsCategory implements ValidationRule
{
    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public $category;

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if($this->category->client_id != $value){
            $fail("This client does not own the category");
        }
    }
}
