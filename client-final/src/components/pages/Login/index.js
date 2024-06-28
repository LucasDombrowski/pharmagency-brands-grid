import { useEffect, useState } from "react";
import TextInput from "../../forms/inputs/TextInput";
import WhiteLogo from "../../images/logos/WhiteLogo";
import CheckboxInput from "../../forms/inputs/CheckboxInput";
import Button from "../../Button";
import { Circles } from "react-loader-spinner";
import { BASE_URL, colors } from "../../../settings";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleReCaptcha, GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Login({ redirection = null, setToken, setCookie, token }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (recaptchaToken !== null) {
            if (!loading) {
                setLoading(true);
                setError(null);
                loginUser(email, password);
            }
        } else {
            setError("Captcha invalide.")
        }
    }

    async function loginUser(email, password) {
        const data = { email, password };
        try {
            const response = await axios.post(`${BASE_URL}/login`, data, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            setToken(response.data.access_token);
            if (remember) {
                setCookie("token", response.data.access_token);
            }
            navigate("/admin");
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 401) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError("Une erreur s'est produite lors de la connexion.");
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            navigate("/admin");
        }
    }, [token]);

    return (
        <GoogleReCaptchaProvider reCaptchaKey='6LeSTQMqAAAAACX3NXiuvsMj_t1l7aGgrvE5QY_k' language='fr'>
            <div className="w-dvw h-dvh bg-gradient-to-r from-pharmagency-blue to-pharmagency-cyan relative">
                <div
                    className="absolute w-full h-full top-0 left-0 bg-cover bg-center opacity-10"
                    style={{
                        background: "url('/images/background.jpg')"
                    }}></div>
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
                                        required
                                    />
                                </div>
                                <CheckboxInput
                                    label={"Se souvenir de moi"}
                                    checked={remember}
                                    setValue={setRemember}
                                    className={"mt-4"}
                                />
                                <GoogleReCaptcha onVerify={(token) => {
                                    setRecaptchaToken(token);
                                }} />
                                {error && <p className="text-pharmagency-red text-center mt-4">{error}</p>}
                                <Button
                                    type="submit"
                                    className={"border-2 border-pharmagency-white transition-all hover:text-pharmagency-blue hover:bg-pharmagency-white mt-4 self-end"}>
                                    {loading ? <Circles
                                        width={20}
                                        height={20}
                                        color={colors.white} />
                                        : <span>Se connecter</span>}
                                </Button>
                            </form>
                        </div>
                        <div className="absolute w-full h-full top-0 left-0 bg-pharmagency-cyan z-40 opacity-60"></div>
                    </div>
                </div>
            </div>
        </GoogleReCaptchaProvider>
    );
}
