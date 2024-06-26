<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Client;
use App\Rules\CheckCategoryName;
use App\Rules\ClientOwnsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @tags Client categories
 */

class CategoryController extends Controller
{

    /**
     * Display all client categories
     * 
     * ## Example
     * ```
     * https://data.catalogues-pharmagency.fr/api/categories?query="Lorem Ipsum"&limit=10&page=2
     * ```
     */

    public function index(Request $request)
    {
        $request->validate([
            "query" => "nullable|string",
            /**
             * Paginate the results according to this value.
             */
            "limit" => "nullable|integer",
            "page"=>"nullable|integer"
        ]);

        $categories  = Category::query();
        if($request->filled("query")){
            $categories->where("name","like","%".$request->input("query")."%");
        }

        if(Auth::guard('sanctum')->check()){
            $categories->with("client");
        } else {
            $categories->with([
                "client"=> function($query){
                    $query->select(["id","name","domain"]);
                }
            ]);
        }

        if($request->filled("limit")){
            $results = $categories->paginate($request->input("limit", 10));
        } else {
            $results = $categories->get();
        }

        return 
        /**
         * Returns all client categories in the database. The clients tokens will be displayed if you are authenticated.
         * 
         * If the "limit" request parameter is null, only the data array will be returned.
         * @body array{current_page: integer, data: array{array{id: int, name: string, client_id: int, client: array{id: int, name: string, domain: string, departmentCode: int, token: string|null}, client_order: int|null}}, first_page_url: string, from: integer, last_page: integer, last_page_url: string, links: array{array{url: string|null, label:string,active:bool}},next_page_url: string, path: string, per_page: integer, prev_page_url: string|null, to: integer, total: integer}
         */
        $results;
    }

    /**
     * Add a new client category to the database.
     * 
     * The new category need to have **at least one brand** linked to it. \
     * For each brands, the back-end process will check if the name already exists in the database :
     * * If the case written above is **true**, the already existing entry is linked to the category.
     * * If the case written above is **false**, a new brand is inserted in the database, but its validation state is set to false. **Only an authenticated user can change the validation state.** The newly created brand will be linked to the category.
     * @unauthenticated
     */
    public function store(Request $request)
    {
        $request->validate([
            //The client id
            "client_id"=>"required|integer|exists:clients,id",
            //The client token
            "client_token"=>"required|string|exists:clients,token",
            //The category name, it must be different than the others client's categories.
            "name"=>["required","string",new CheckCategoryName(Client::findOrFail($request->input("client_id") ? $request->input("client_id") : 1))],
            "brands"=>"required|array",
            "brands.*"=>"required|array",
             //The brand name. The value will be parsed into the correct naming format.
            "brands.*.name"=>"required|string",
             /**
             * The image url, it has to be a png or jpg file.
             * @example https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
             */
            "brands.*.url"=>"nullable|url",
            //The index in the client categories order
            "order"=>"integer|nullable"
        ]);

        $client = Client::find($request->input("client_id"));
        if($client->token != $request->input("client_token")){
            return 
            /**
             * Error thrown when a wrong id/token combination is given.
             * @status 401
             */
            response()->json(["message"=>"Client id and token are not matching"],401);
        }

        $category = Category::create([
            "name"=>$request->input("name"),
            "client_id"=>$client->id,
            "client_order"=>$request->input("order",count($client->categories) + 1)
        ]);

        $count = 1;

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
                    return 
                    /**
                     * Error thrown when one of the image links leads to an incorrect extension.
                     * @status 415
                     */
                    response()->json(["message"=>"The image link is not in png or jpg"],415);
                }
                $brandModel = Brand::create($brandData);
            }
            $category->brands()->attach($brandModel,["order"=>$count]);
            $count ++;
        }

        return 
        /**
         * Returns the new client's category with its brands.
         * @body array{id: int, name: string, client_id: int, client_order: int, client: array{id: int, name: string, domain: string, departmentCode: int, token: string}, brands: array{array{id: int, png_url: string|null, jpg_url: string|null, validated: bool}}}
         */
        response()->json($category->load("client","brands"),201);

    }

    /**
     * Find a specific client category.
     */
    public function show(Category $category)
    {
        if(Auth::guard("sanctum")->check()){
            $category->load("client");
        } else {
            $category->load([
                "client"=>function($query){
                    $query->select(["id","name"]);
                }
            ]);
        }
        $category->load("brands");
        return 
        /**
         * Returns the client category which has the given id in the database, with its brands. The client token will be displayed if you are authenticated.
         * @body array{id: int, name: string, client_id: int, client_order: int|null, client: array{id: int, name: string, domain: string, departmentCode: int, token: string|null}, brands: array{array{id: int, png_url: string|null, jpg_url: string|null, validated: bool}}}
         */
        response()->json($category);
    }

    /**
     * Update a specific client category data.
     * 
     * The updated category need to have **at least one brand** linked to it. \
     * For each brands, the back-end process will check if the name already exists in the database :
     * * If the case written above is **true** and the brand **is not already associated to the category**, the already existing entry is linked to the category.
     * * If the case written above is **false**, a new brand is inserted in the database, but its validation state is set to false. **Only an authenticated user can change the validation state.** The newly created brand will be linked to the category.
     * If a brand previously associated to the category is not in the body data, it will be automatically dissociated from the category.
     * @unauthenticated
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            //The client id, it must be the client that owns the category
            "client_id"=>["required","integer","exists:clients,id", new ClientOwnsCategory($category)],
            //The client token
            "client_token"=>"required|string|exists:clients,token",
            //The category name, it must be different than the others client's categories.
            "name"=>["required","string",new CheckCategoryName(Client::findOrFail($request->input("client_id") ? $request->input("client_id") : 1), $category)],
            "brands"=>"required|array",
            "brands.*"=>"required|array",
            //The brand name. The value will be parsed into the correct naming format.
            "brands.*.name"=>"required|string",
            /**
             * The image url, it has to be a png or jpg file.
             * @example https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
             */
            "brands.*.url"=>"nullable|url",
            //The index in the client categories order
            "order"=>"integer|nullable"
        ]);

        if(Client::find($request->input("client_id"))->token != $request->input("client_token")){
            return 
             /**
             * Error thrown when a wrong id/token combination is given.
             * @status 401
             */
            response()->json(["message"=>"Client id and token are not matching"],401);
        }

        $inputBrandNames = array_map(function($v){
            return parseBrandName($v["name"]);
        }, $request->input("brands"));

        $brandsToDetach = $category->brands->whereNotIn("name",$inputBrandNames);

        foreach($brandsToDetach as $brandToDetach){
            $category->brands()->detach($brandToDetach);
        }

        $count = 1;
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
                        return 
                         /**
                         * Error thrown when one of the image links leads to an incorrect extension.
                         * @status 415
                         */
                        response()->json(["message"=>"The image link is not in png or jpg"],500);
                    }
                    $brandModel = Brand::create($brandData);
                }
                $category->brands()->attach($brandModel,["order"=>$count]);
            } else {
                $category->brands()->updateExistingPivot($category->brands->where("name",$brandData["name"])->first(),["order"=>$count]);
            }
            $count++;
        }

        $category->update([
            "name"=>$request->input("name"),
            "client_order"=>$request->input("order",$category->client_order)
        ]);

        return 
        /**
         * Returns the updated category with its brands.
         * @body array{id: int, name: string, client_id: int, client_order: int|null, client: array{id: int, name: string, domain: string, departmentCode: int, token: string}, brands: array{array{id: int, png_url: string|null, jpg_url: string|null, validated: bool}}}
         */
        response()->json($category->load("brands"));
    }

    /**
     * Delete a specific client category from the database.
     * 
     * **WARNING :** Only the category and the brands associations will be deleted. You must use a different method to directly delete brands.
     * @unauthenticated
     */
    public function destroy(Category $category, Request $request)
    {
        $request->validate([
            //The client id, it must be the client that owns the category
            "client_id"=>["required","integer","exists:clients,id", new ClientOwnsCategory($category)],
            //The client token
            "client_token"=>"required|string|exists:clients,token"
        ]);
        if(Client::find($request->input("client_id"))->token != $request->input("client_token")){
            return 
             /**
             * Error thrown when a wrong id/token combination is given.
             * @status 401
             */
            response()->json(["message"=>"Client id and token are not matching"],401);
        }
        $categories = $category->client->categories;
        $count = 1;
        foreach($categories as $clientCategory){
            $clientCategory->update([
                "client_order"=>$count
            ]);
            $count++;
        }
        $category->brands()->detach();
        $category->delete();
        return response("",204);
    }
}
