<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Rules\CheckParsedBrandName;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @tags Brands
 */

class BrandController extends Controller
{

    public function __construct(){
        $this->middleware('auth:sanctum')->except(["index","show"]);
    }

    /**
     * Searching brands
     * 
     * ## Example
     * ```
     * http://localhost:8000/api/brands?query="Lorem Ipsum"&validated=1&limit=10
     * ```
     * @unauthenticated
     */

    public function index(Request $request)
    {

        $request->validate([
            /**
             * The current search query, it will be parsed into the correct naming format. \
             * Example : "***Lorem Ipsum***" will be interpreted as "***lorem-ipsum***"
             */
            "query"=>"nullable|string",
            /**
             * Filter by the validation status of the brand, the value must be 0 or 1.
             */
            "validated"=>"nullable|boolean",
            /**
             * Limit the results to a specific amount.
             */
            "limit"=>"nullable|integer"
        ]);

        $query = Brand::query();

        if($request->filled("query")){
            $query = $query->where("name","like",parseBrandName($request->input("query"))."%");
        }

        if($request->filled("validated")){
            $query = $query->where("validated",$request->input("validated"));
        }

        if($request->filled("limit")){
            $query = $query->take($request->input("limit"));
        }

        $results = $query->withCount("categories")->orderBy("categories_count","desc")->get();

        /**
         * Returns the results.
         * @body array{array{id:int, name:string, png_url:string|null,jpg_url:string|null,validated: true}}
        */
        return response()->json($results);
    }

    /**
     * Add a brand to the database.
     * 
     * By this way, the brand will be instantly a valid one at its creation.
     */
    public function store(Request $request)
    {
        $request->validate([
            //The brand name, it must be unique. The value will be parsed into the correct naming format.
            "name"=>["required","string", new CheckParsedBrandName],
            /**
             * The image url, it has to be a png or jpg file.
             * @example https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
             */
            "url"=>"required|url",
        ]);

        $brandData = [
            "name"=>parseBrandName($request->input("name")),
            "validated"=>true
        ];
        $url = $request->input("url");
        $extension = pathinfo($url,PATHINFO_EXTENSION);
        if(str_starts_with($extension,"png")){
            $brandData["png_url"] = $url;
        } else if(str_starts_with($extension,"jpg") || str_starts_with($extension,"jpeg")){
            $brandData["jpg_url"] = $url;
        } else {
            return 
            /**
             * Error thrown when the image link leads to an incorrect extension.
             * @status 415
             */
            response()->json(["message"=>"The image link is not in png or jpg"],415);
        }
        $brand = Brand::create($brandData);

        return 
        /**
         * Returns the created brand
         * @body array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: true}
         */
        response()->json($brand,201);
    }

    /**
     * Find a specific brand
     * @unauthenticated
     */
    public function show(Brand $brand)
    {
       return 
       /**
        * Returns the brand which has the given id in the database.
        * @body array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}
        */
       response()->json($brand);
    }

    /**
     * Update a specific brand data.
     */
    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            //The brand name, it must be unique. The value will be parsed into the correct naming format.
            "name"=>["required","string", new CheckParsedBrandName($brand)],
             /**
             * The image url, it has to be a png or jpg file.
             * @example https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
             */
            "url"=>"required|url",
            //A boolean value which indicate if the brand is valid or not.
            "validated"=>"nullable|boolean"
        ]);

        $brandData = [
            "name"=>parseBrandName($request->input("name")),
            "validated"=>$request->input("validated",0)
        ];

        $url = $request->input("url");

        $extension = pathinfo($url,PATHINFO_EXTENSION);

        if(str_starts_with($extension,"png")){
            $brandData["png_url"] = $url;
        } else if(str_starts_with($extension,"jpg") || str_starts_with($extension,"jpeg")){
            $brandData["jpg_url"] = $url;
        } else {
            return 
            /**
             * Error thrown when the image link leads to an incorrect extension.
             * @status 415
             */
            response()->json(["message"=>"The image link is not in png or jpg"],415);
        }
        $brand->update($brandData);
        return 
        /**
         * Returns the updated brand
         * @body array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}
         */
        response()->json($brand);
    }

    /**
     * Delete a specific brand from the database.
     */
    public function destroy(Brand $brand)
    {
        $categories = $brand->categories;
        foreach($categories as $category){
            $count = 1;
            foreach($category->brands as $categoryBrand){
                if($categoryBrand->id !== $brand->id){
                    $category->brands()->updateExistingPivot($categoryBrand,["order"=>$count]);
                    $count++;
                }
            } 
        }
        $brand->categories()->detach();
        $brand->delete();
        return 
        /**
         */
        response("",204);
    }
}
