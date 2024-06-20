import { useEffect, useState } from "react";
import TextInput from "../../forms/inputs/TextInput";
import WhiteLogo from "../../images/logos/WhiteLogo";
import CheckboxInput from "../../forms/inputs/CheckboxInput";
import Button from "../../Button";
import { Circles } from "react-loader-spinner";
import { BASE_URL, colors } from "../../../settings";
import axios from "axios";
import { useNavigate, useNavigation } from "react-router-dom";

export default function Login({ redirection = null, setToken, setCookie, token }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember,setRemember] = useState(false);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        if(!loading){
            setLoading(true);
            setError(null);
            loginUser(email, password);
        }
    }

    async function loginUser(email, password){
        const data = {email, password};
        try{
            const response = await axios.post(`${BASE_URL}/login`,data,{
                headers: {
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                }
            });
            setToken(response.data.access_token);
            if(remember){
                setCookie("token",response.data.access_token);
            }
            navigate("/admin");
        }catch(err){
            console.log(err);
            if(err.response.status === 401){
                setError("Email ou mot de passe incorrect.")
            }
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(token){
            navigate("/admin");
        }
    },[token]);

    return (
        <div className="w-dvw h-dvh bg-gradient-to-r from-pharmagency-blue to-pharmagency-cyan relative">
            <div
                className="absolute w-full h-full top-0 left-0 bg-cover bg-center opacity-10"
                style={
                    {
                        background: "url('/images/background.jpg')"
                    }
                }></div>
            <div className="w-full h-full flex justify-center items-center px-6">
                <div className="w-full max-w-[550px] relative py-16 px-8 overflow-hidden rounded-3xl">
                    <div className="relative z-50 flex flex-col items-center text-pharmagency-white w-full">
                        <WhiteLogo className={"max-w-[250px]"} />
                        <div className="mt-8">
                            <div className="uppercase text-20 font-light">
                                accès marques pharmacies
                            </div>
                            <h1 className="uppercase text-50 font-medium">connexion</h1>
                        </div>
                        <form className="mt-8 flex flex-col w-full" onSubmit={handleSubmit}>
                            <div className="w-full">
                                <TextInput
                                    type={"email"}
                                    placeholder={"Adresse mail"}
                                    svgIcon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 25 28.571">
                                        <path id="Icon_fa-solid-user" data-name="Icon fa-solid-user" d="M12.5,14.286A7.143,7.143,0,1,0,5.357,7.143,7.143,7.143,0,0,0,12.5,14.286ZM9.95,16.964A9.948,9.948,0,0,0,0,26.914a1.658,1.658,0,0,0,1.657,1.657H23.343A1.658,1.658,0,0,0,25,26.914a9.948,9.948,0,0,0-9.95-9.95H9.95Z" fill="#707070" />
                                    </svg>
                                    }
                                    value={email}
                                    setValue={setEmail}
                                    className={"mb-4"}
                                    required
                                />
                                <TextInput
                                    type={"password"}
                                    placeholder={"Mot de passe"}
                                    value={password}
                                    setValue={setPassword}
                                    svgIcon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 25 28.571">
                                        <path id="Icon_fa-solid-lock" data-name="Icon fa-solid-lock" d="M8.036,8.036v2.679h8.929V8.036a4.464,4.464,0,0,0-8.929,0ZM4.464,10.714V8.036a8.036,8.036,0,0,1,16.071,0v2.679h.893A3.575,3.575,0,0,1,25,14.286V25a3.575,3.575,0,0,1-3.571,3.571H3.571A3.575,3.575,0,0,1,0,25V14.286a3.575,3.575,0,0,1,3.571-3.571Z" fill="#707070" />
                                    </svg>
                                    }
                                    required />
                            </div>
                            <CheckboxInput
                            label={"Se souvenir de moi"}
                            checked={remember}
                            setValue={setRemember}
                            className={"mt-4"}/>
                            {error && <p className="text-pharmagency-red text-center mt-4">{error}</p>}
                            <Button
                            type="submit"
                            className={"border-2 border-pharmagency-white transition-all hover:text-pharmagency-blue hover:bg-pharmagency-white mt-4 self-end"}>
                                {loading ? <Circles
                                width={20}
                                height={20}
                                color={colors.white}/>
                                : <span>Se connecter</span>}
                            </Button>
                        </form>
                    </div>
                    <div className="absolute w-full h-full top-0 left-0 bg-pharmagency-cyan z-40 opacity-60"></div>
                </div>
            </div>
        </div>
    )
}