<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Client;
use App\Rules\CheckCategoryName;
use App\Rules\ClientOwnsCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(){
        $this->middleware('auth:sanctum')->only(["destroy"]);
    }

    public function index()
    {
        return response()->json(Category::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "client_id"=>"required|integer|exists:clients,id",
            "client_token"=>"required|string|exists:clients,token",
            "name"=>["required","string",new CheckCategoryName(Client::findOrFail($request->input("client_id")))],
            "brands"=>"required|array",
            "brands.*"=>"required|array",
            "brands.*.name"=>"required|string",
            "brands.*.url"=>"nullable|url"
        ]);

        if(Client::find($request->input("client_id"))->token != $request->input("client_token")){
            return response()->json(["message"=>"Client id and token are not matching"],401);
        }

        $category = Category::create([
            "name"=>$request->input("name"),
            "client_id"=>$request->input("client_id")
        ]);

        foreach($request->input("brands") as $brand){
            $brandData = [
                "name"=>parseBrandName($brand["name"])
            ];
            $brandModel = Brand::where("name",$brandData["name"])->first();
            if(!$brandModel instanceof Brand){
                $extension = pathinfo($brand["url"],PATHINFO_EXTENSION);
                if(str_starts_with($extension,"png")){
                    $brandData["png_url"] = $brand["url"];
                } else if(str_starts_with($extension,"jpg") || str_starts_with($extension,"jpeg")){
                    $brandData["jpg_url"] = $brand["url"];
                } else {
                    return response()->json(["message"=>"The image link is not in png or jpg"],500);
                }
                $brandModel = Brand::create($brandData);
            }
            $category->brands()->attach($brandModel);
        }

        return response()->json($category->load("brands"),201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return response()->json($category->load("brands"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            "client_id"=>["required","integer","exists:clients,id", new ClientOwnsCategory($category)],
            "client_token"=>"required|string|exists:clients,token",
            "name"=>"required|string",
            "brands"=>"required|array",
            "brands.*"=>"required|array",
            "brands.*.name"=>"required|string",
            "brands.*.url"=>"nullable|url"
        ]);

        if(Client::find($request->input("client_id"))->token != $request->input("client_token")){
            return response()->json(["message"=>"Client id and token are not matching"],401);
        }

        $inputBrandNames = array_map(function($v){
            return parseBrandName($v["name"]);
        }, $request->input("brands"));

        $brandsToDetach = $category->brands->whereNotIn("name",$inputBrandNames);

        foreach($brandsToDetach as $brandToDetach){
            $category->brands()->detach($brandToDetach);
        }

        foreach($request->input("brands") as $brand){
            $brandData = [
                "name"=>parseBrandName($brand["name"])
            ];
            if(!$category->brands->where("name",$brandData["name"])->first() instanceof Brand){
                $brandModel = Brand::where("name",$brandData["name"])->first();
                if(!$brandModel instanceof Brand){
                    $extension = pathinfo($brand["url"],PATHINFO_EXTENSION);
                    if(str_starts_with($extension,"png")){
                        $brandData["png_url"] = $brand["url"];
                    } else if(str_starts_with($extension,"jpg") || str_starts_with($extension,"jpeg")){
                        $brandData["jpg_url"] = $brand["url"];
                    } else {
                        return response()->json(["message"=>"The image link is not in png or jpg"],500);
                    }
                    $brandModel = Brand::create($brandData);
                }
                $category->brands()->attach($brandModel);
            }
        }

        return response()->json($category->load("brands"));
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->brands()->detach();
        $category->delete();
        return response("",204);
    }
}
