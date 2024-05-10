<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Dirape\Token\Token;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Client::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name"=>"required|string",
        ]);

        $client = Client::create([
            "name"=>$request->input("name"),
            "token"=> (new Token())->Unique('clients', 'token', 16)
        ]);

        return response()->json($client,201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return response()->json($client->load("categories"));
    }

    public function showToken(string $token){
        return response()->json(Client::where("token",$token)->firstOrFail()->load("categories"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $request->validate([
            "name"=>"required|string",
            "token"=>"prohibited"
        ]);

        $client->update($request->all());

        return response()->json($client);
    }

    /**
     * Remove the specified resource from storage.
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
