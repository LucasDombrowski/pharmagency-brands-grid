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
                png_url:"https://www.catalogues-pharmagency.fr/wp-content/uploads/marques/avene.png",
                jpg_url:null
            }
        } title={"Ajouter marque"}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}/>
    )
}