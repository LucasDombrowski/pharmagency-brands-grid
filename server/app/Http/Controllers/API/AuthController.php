<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @tags Authentication
 */
class AuthController extends Controller
{

    /**
     * Admin login
     * 
     * If the email/password combination matches the current records, you will receive the Bearer token to put in the Authorization header at the protected endpoints. 
     * @unauthenticated
     */
    public function login(Request $request) {
        $request->validate([
            /**
             * The admin account email
             * @example admin@admin.com
             */
            "email"=>"required|email",
            /**
             * The admin account password
             * @example admin
             */
            "password"=>"required|string"
        ]);

        if(Auth::attempt($request->all())){
            $user = User::where("email",$request->input("email"))->first();
            $token = $user->createToken("auth_token")->plainTextToken;

            /**
             * Returns the access Bearer token.
             */
            return response()->json([
                "access_token"=>$token,
                "token_type"=>"Bearer"
            ]);
        } else {
            /**
             * Thrown error when the email / password combination does not match the current records.
             * @status 401
             */
            return response()->json(["message"=>"Wrong credentials"],401);
        }
    }
}
