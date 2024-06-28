import { useEffect, useState } from "react";
import BrandForm from "../../BrandForm";
import axios from "axios";
import { BASE_URL } from "../../../settings";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "sortablejs";

export default function EditBrand({token}){
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [brand,setBrand] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    async function handleSubmit(e,name,url){
        e.preventDefault();
        setLoading(true);
        setError(null);
        const data = {name,url}
        try{
            await axios.post(`${BASE_URL}/brands/${id}?_method=PUT`,data,{
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

    async function getBrand(){
        try{
            const response = await axios.get(`${BASE_URL}/brands/${id}`);
            setBrand(response.data);
        } catch(err){
            navigate("/admin/marques");
        }
    }

    useEffect(()=>{
        getBrand();
    })

    if(brand){
        return (
            <BrandForm brand={brand} title={"Modifier marque"}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}/>
        )
    } else {
        return null;
    }
}