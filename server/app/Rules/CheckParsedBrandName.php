<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

use App\Models\Brand;

class CheckParsedBrandName implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */

    public function __construct(Brand $brand = null)
    {
        $this->brand = $brand;
    }

    public $brand;

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = Brand::where("name",parseBrandName($value));
        if($this->brand instanceof Brand){
            $query = $query->where("id","!=",$this->brand->id);
        }
        if($query->first() instanceof Brand){
            $fail("Brand name already exists");
        }
    }
}
