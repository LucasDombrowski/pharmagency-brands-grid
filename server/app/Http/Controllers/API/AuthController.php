<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            "email"=>"required|email",
            "password"=>"required|string"
        ]);

        if(Auth::attempt($request->all())){
            $user = User::where("email",$request->input("email"))->first();
            $token = $user->createToken("auth_token")->plainTextToken;

            return response()->json([
                "access_token"=>$token,
                "token_type"=>"Bearer"
            ]);
        } else {
            return response()->json(["message"=>"Wrong credentials"],401);
        }
    }
}
