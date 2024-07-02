import { useState } from "react";
import ClientForm from "../../ClientForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../settings";

export default function AddDomain({token}){
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e,name,domain,departmentCode){
        e.preventDefault();
        setLoading(true);
        setError(null);
        const data = {name,domain,departmentCode};
        try{
            await axios.post(`${BASE_URL}/clients`,data,{
                headers : {
                    "Content-Type":"application/json",
                    "Accept":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            });
            navigate("/admin");
        } catch(err){
            if(err.response.data.message){
                setError(err.response.data.message);
            }
            setLoading(false);
        }
    }

    return (
        <ClientForm title={"Ajouter un domaine"} client={
            {
                "name":"Nouveau client",
                "domain":"domaine.com",
                "departmentCode":59
            }
        } error={error} loading={loading} onSubmit={handleSubmit}/>
    );
}