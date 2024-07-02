import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../settings";
import ClientForm from "../../ClientForm";

export default function EditDomain({token}){
    const {id} = useParams();
    const [client,setClient] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e,name,domain,departmentCode){
        e.preventDefault();
        setLoading(true);
        setError(null);
        const data = {name,domain,departmentCode};
        try{
            await axios.put(`${BASE_URL}/clients/${id}`,data,{
                headers :  {
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

    async function getClient(){
        try{
            const response = await axios.get(`${BASE_URL}/clients/${id}`);
            setClient(response.data);
        } catch(err){
            navigate("/admin");
        }
    }

    useEffect(()=>{
        getClient();
    },[]);

    if(client){
        return (
            <ClientForm
            title={"Modifier un domaine"}
            client={client}
            error={error}
            loading={loading}
            onSubmit={handleSubmit}/>
        )
    } else {
        return null;
    }
}