<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
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
        $this->middleware('auth:sanctum')->except(["showToken","show","index","showClientBrands"]);   
    }
    /**
     * Display all clients.
     */
    public function index()
    {
        if(!Auth::guard("api")->check()){
            $query = Client::select(["id","name"])->get();
        } else {
            $query = Client::all();
        }
        return 
        /**
         * Returns all clients in the database. Their tokens will be revealed if you are authenticated.
         * @body array{array{id: int, name: string, token: string|null}}
         */
        response()->json($query);
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
        ]);

        $client = Client::create([
            "name"=>$request->input("name"),
            "token"=> (new Token())->Unique('clients', 'token', 16)
        ]);

        return
        /**
         * Returns the created client with his unique token.
         * @body array{id: int, name:string, token: string}
         */ 
        response()->json($client,201);

    }

    /**
     * Find a specific client
     */
    public function show(Client $client)
    {
        if(!Auth::guard("api")->check()){
            $client->setHidden(["token"]);
        }
        return
        /**
         * Returns the client which has the given id in the database, with his categories and their brands. His token will be displayed if you are authenticated.
         * @body array{id: int, name: string, token: string|null, categories: array{array{id: int, name: string, client_id: int, brands: array{array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}}}}}
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
            //A forbidden input, do not include it in the request body
            "token"=>"prohibited"
        ]);

        $client->update($request->all());

        return
        /**
         * Returns the updated client.
         * @body array{id: int, name:string, token: string}
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
