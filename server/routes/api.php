<?php

use App\Http\Controllers\API\ClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;

Route::apiResource("clients",ClientController::class);

Route::get("/clients/token/{token}",[ClientController::class,"showToken"]);
Route::apiResource("categories",CategoryController::class);
