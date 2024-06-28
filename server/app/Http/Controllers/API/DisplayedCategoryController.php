<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DisplayedCategory;
use Illuminate\Http\Request;

/**
 * @tags Displayed categories
 */
class DisplayedCategoryController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum')->except(["index"]);   
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DisplayedCategory::all()->pluck("name");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name"=>"required|string|max:255"
        ]);
        $displayedCategory = DisplayedCategory::create([
            "name"=>$request->input("name")
        ]);
        return response()->json(["message"=>"Displayed category created successfuly","displayed_category"=>$displayedCategory],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(DisplayedCategory $displayedCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DisplayedCategory $displayedCategory)
    {
        $request->validate([
            "name"=>"required|string|max:255"
        ]);
        $displayedCategory->update([
            "name"=>$request->input("name")
        ]);
        return response()->json(["message"=>"Displayed category updated successfuly","displayed_category"=>$displayedCategory],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DisplayedCategory $displayedCategory)
    {
        $displayedCategory->delete();
        return response()->json(["message"=>"Displayed category deleted successfuly"]);
    }
}
