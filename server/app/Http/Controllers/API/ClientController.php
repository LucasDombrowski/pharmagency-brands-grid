<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Rules\FQDN;
use Illuminate\Http\Request;
use Dirape\Token\Token;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

use function Laravel\Prompts\select;

/**
 * @tags Clients
 */

class ClientController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum')->except(["showToken","show","index","showClientBrands","showDomain"]);   
    }
    /**
     * Display all clients.
     */
    public function index(Request $request)
    {
        $request->validate([
            "query"=>"nullable|string",
            "limit"=>"nullable|integer"
        ]); 

        $query = Client::query();

        if($request->filled("query")){
            $query = $query->where("name","like",$request->input("query")."%");
        }

        if($request->filled("limit")){
            $query = $query->take($request->input("limit"));
        }

        $query = $query->orderBy("created_at","desc");

        if(!Auth::guard("sanctum")->check()){
            $query = $query->select(["id","name","domain","created_at","departmentCode"]);
        } 

        return 
        /**
         * Returns all clients in the database. Their tokens will be revealed if you are authenticated.
         * @body array{array{id: int, name: string, domain: string, departmentCode: int, token: string|null}}
         */
        response()->json($query->get());
    }

    /**
     * Add a new client to the database
     * 
     * Create a new client with an automatically generated token.
     */
    public function store(Request $request)
    {
        $request->validate([
            //The client name
            "name"=>"required|string",
            "domain"=>["required","string",new FQDN],
            //The french department code where the client is located at
            "departmentCode"=>"required|integer|digits:2"
        ]);

        $client = Client::create([
            "name"=>$request->input("name"),
            "domain"=>$request->input("domain"),
            "token"=> (new Token())->Unique('clients', 'token', 16),
            "departmentCode"=>$request->input("departmentCode")
        ]);

        return
        /**
         * Returns the created client with his unique token.
         * @body array{id: int, name:string, domain: string, departmentCode: int, token: string}
         */ 
        response()->json($client,201);

    }

    /**
     * Find a specific client with its id
     */
    public function show(Client $client)
    {
        if(!Auth::guard("sanctum")->check()){
            $client->setHidden(["token"]);
        }
        return
        /**
         * Returns the client which has the given id in the database, with his categories and their brands. His token will be displayed if you are authenticated.
         * @body array{id: int, name: string, domain: string, departmentCode: int, token: string|null, categories: array{array{id: int, name: string, client_id: int, brands: array{array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}}}}}
         */
        response()->json($client->load("categories","categories.brands"));
    }

    /**
     * Find a specific client with its token
     */

    public function showToken(string $token){
        return 

         /**
         * Returns the client which has the given token in the database, with his categories and their brands.
         * @body array{id: int, name: string, domain: string, departmentCode: int, token: string|null, categories: array{array{id: int, name: string, client_id: int, brands: array{array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}}}}}
         */

        response()->json(Client::where("token",$token)->firstOrFail()->load("categories","categories.brands"));
    }

    /**
     * Find a specific client with its domain
     */

    public function showDomain(string $domain){
        $client = Client::where("domain",$domain)->firstOrFail();
        if(!Auth::guard("sanctum")->check()){
            $client->setHidden(["token"]);
        }
        return 
        /**
         * Returns the client which has the given domain in the database, with his categories and their brands. His token will be displayed if you are authenticated.
         * @body array{id: int, name: string, domain: string, departmentCode: int, token: string|null, categories: array{array{id: int, name: string, client_id: int, brands: array{array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}}}}}
         */
        response()->json($client->load("categories","categories.brands"));

    }
    /**
     * Only get a client's associated brands
     * @unauthenticated
     */

    public function showClientBrands(Client $client){
        $res = new Collection();
        foreach($client->categories as $category){
            $res = $res->merge($category->brands);
        }
        return 
        /**
         * Returns all of the brands associated with the client's categories.
         * @body array{array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}}
         */
        response()->json($res);
    }

    /**
     * Update a specific client data
     */
    public function update(Request $request, Client $client)
    {
        $request->validate([
            //The client name
            "name"=>"required|string",
            "domain"=>["required","string",new FQDN],
            //The french department code where the client is located at
            "departmentCode"=>"required|integer|digits:2",
            //A forbidden input, do not include it in the request body
            "token"=>"prohibited"
        ]);

        $client->update($request->all());

        return
        /**
         * Returns the updated client.
         * @body array{id: int, domain: string, name:string, departmentCode: int, token: string}
         */ 
        response()->json($client);
    }

    /**
     * Delete a specific client from the database
     * 
     * Delete a client and his own categories. The categories brands will not be deleted.
     */
    public function destroy(Client $client)
    {
        $categories = $client->categories;

        foreach($categories as $category){
            $category->brands()->detach();
            $category->delete();
        }

        $client->delete();

        return response("",204);
    }
}
