<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\API\BrandController;
use App\Http\Controllers\API\DisplayedCategoryController;

Route::apiResource("clients",ClientController::class);
Route::get("/clients/token/{token}",[ClientController::class,"showToken"]);
Route::get("/clients/{client}/brands",[ClientController::class, "showClientBrands"]);
Route::get("/clients/domain/{domain}",[ClientController::class,"showDomain"]);
Route::apiResource("categories",CategoryController::class);
Route::apiResource("/brands",BrandController::class);
Route::apiResource("/displayed-categories",DisplayedCategoryController::class)->except(["show"]);

Route::post("/login",[AuthController::class,"login"]);

