<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\API\BrandController;

Route::apiResource("clients",ClientController::class);
Route::get("/clients/token/{token}",[ClientController::class,"showToken"]);
Route::get("/clients/{client}/brands",[ClientController::class, "showClientBrands"]);
Route::apiResource("categories",CategoryController::class);
Route::apiResource("/brands",BrandController::class);

Route::post("/login",[AuthController::class,"login"]);

