<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Rules\CheckParsedBrandName;
use Illuminate\Http\Request;

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
     * http://localhost:8000/api/brands?query="Lorem Ipsum"&validated=1
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
            "validated"=>"nullable|boolean"
        ]);

        $query = Brand::query();

        if($request->filled("validated") &&  $request->input("validated") == true){
            $query = $query->where("validated",true);
        }

        if($request->filled("query")){
            $query = $query->where("name","like",parseBrandName($request->input("query"))."%");
        }

        if(!empty($request->all())){
            $query = $query->take(10);
        }

        $results = $query->get();

        /**
         * Returns the results.
         * * If the query parameter is null, **all** of the brands which fit with the "validated" value will be returned.
         * * If the query parameter is not null, **the first 5 results** which fit with the "validated" value will be returned.
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
        $brand->categories()->detach();
        $brand->delete();
        return 
        /**
         */
        response("",204);
    }
}
