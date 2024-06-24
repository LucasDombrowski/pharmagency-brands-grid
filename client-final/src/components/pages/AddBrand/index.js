import { useState } from "react";
import BrandForm from "../../BrandForm";
import axios from "axios";
import { BASE_URL } from "../../../settings";
import { useNavigate } from "react-router-dom";

export default function AddBrand({token}){
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const navigate = useNavigate();
    async function handleSubmit(e,name,url){
        e.preventDefault();
        setLoading(true);
        setError(null);
        const data = {name,url}
        try{
            await axios.post(`${BASE_URL}/brands`,data,{
                headers : {
                    "Content-Type":"application/json",
                    "Accept":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            });
            navigate("/admin/marques");
        } catch(err){
            if(err.response.data.message){
                setError(err.response.data.message);
            }
            setLoading(false);
        }
    }
    return (
        <BrandForm brand={
            {
                id: null,
                name: "nom-de-la-marque",
                png_url:"https://i0.wp.com/caravanedesdixmots.com/wp-content/uploads/2021/05/placeholder.png?ssl=1",
                jpg_url:null
            }
        } title={"Création d'une marque"}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}/>
    )
}