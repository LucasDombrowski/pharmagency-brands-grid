import axios from "axios";
import { useEffect, useState } from "react"
import { server } from "../../data/globals";
import { useNavigate } from "react-router-dom";

export default function LoginForm(props){
    const [email,updateEmail] = useState("");
    const [password,updatePassword] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        if(props.token){
            navigate("/admin");
        }
    },[props.token]);
    async function handleSubmit(e){
        e.preventDefault();
        const data = {
            "email":email,
            "password":password
        }
        try{
            const request = await axios.post(server + "/login",data, {
                headers: {
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                }
            });
            props.setToken(request.data.access_token);

        } catch(err){
            console.log(err);
        }
        
    }
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-6">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>{
                        updateEmail(e.target.value);
                    }}/>
                </div>
                <div className="flex flex-col mb-10">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={password} placeholder="Password "onChange={(e)=>{
                        updatePassword(e.target.value);
                    }}/>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit
                </button>
                
            </form>
        </div>
    )
}