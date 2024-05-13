<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Rules\CheckParsedBrandName;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(){
        $this->middleware('auth:sanctum')->except(["index","show"]);
    }

    public function index(Request $request)
    {
        $request->validate([
            "query"=>"nullable|string",
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
            $query = $query->take(5);
        }

        $results = $query->get();

        return response()->json($results);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name"=>["required","string", new CheckParsedBrandName],
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
            return response()->json(["message"=>"The image link is not in png or jpg"],500);
        }
        $brand = Brand::create($brandData);
        return response()->json($brand,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
       return response()->json($brand);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            "name"=>["required","string", new CheckParsedBrandName($brand)],
            "url"=>"required|url",
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
            return response()->json(["message"=>"The image link is not in png or jpg"],500);
        }
        $brand->update($brandData);
        return response()->json($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand->categories()->detach();
        $brand->delete();
        return response("",204);
    }
}
