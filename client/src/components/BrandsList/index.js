import { useEffect, useRef, useState } from "react";
import { server } from "../../data/globals";
import axios from "axios";
import BrandsGridItem from "../BrandsClient/BrandsGrid/BrandsGridItem";
import { Link } from "react-router-dom";

export default function BrandsList(props){
    const [brands, setBrands] = useState([]);
    const [validated, setValidated] = useState(true);
    const ref = useRef();
    async function getBrands(query = ""){
        var url = server + "/brands";
        url+=("?query="+query+"&validated="+(validated ? "1" : "0"));
        try{
            const request = await axios.get(url);
            setBrands(request.data);
        } catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getBrands(ref.current.value);
    },[validated]);  

    return (
        <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center">
                <input type="search" name="query" id="query" className="w-full px-3 py-2 text-xl outline-none border-b-2 border-black mb-8" placeholder="Rechercher..." onChange={(e)=>{
                    getBrands(e.target.value);
                }} ref={ref}/>
                <div>
                    <input type="checkbox" name="validated" id="validated" onInput={(e)=>{
                        setValidated(!validated);
                    }} checked={validated}/>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-10">
            {brands.map(
                v=><Link to={"/admin/brands/" + v.id} className="flex flex-col items-center">
                    <BrandsGridItem {...v}/>
                    <div className="font-bold text-xl text-center">{v.name}</div>
                </Link> 
            )}
            </div>
        </div>
    )
}