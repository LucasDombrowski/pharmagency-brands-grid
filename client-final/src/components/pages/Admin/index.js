import clsx from "clsx";
import WhiteLogo from "../../images/logos/WhiteLogo";
import TextInput from "../../forms/inputs/TextInput";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../settings";
import DomainBlock from "./DomainBlock";
import { Link } from "react-router-dom";

export default function Admin({token}){
    const [search,setSearch] = useState("");
    const [domains,setDomains] = useState([]);

    async function getDomains(){
        try{
            const response = await axios.get(`${BASE_URL}/clients?query=${search}&limit=15`,{
                headers:{
                    "Accept":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            });
            setDomains(response.data.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getDomains();
    },[search]);

    const containerClass = "max-w-[1200px]";

    async function handleDelete(id,setLoading){
        try{
            await axios.delete(`${BASE_URL}/clients/${id}`,{
                headers: {
                    "Authorization":`Bearer ${token}`
                }
            });
            getDomains();
            setLoading(false);
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className="w-full">
            <div className="w-full bg-gradient-to-r from-pharmagency-blue to-pharmagency-cyan p-6 sticky top-0 left-0 flex items-center">
                <div className="mr-8">
                    <WhiteLogo className={"max-w-[100px] mobile:max-w-[60px]"}/>
                </div>
                <div className={clsx(
                    "w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[800px] small-computer:static small-computer:translate-x-0 small-computer:translate-y-0 flex items-center"
                )}>
                    <TextInput
                    type={"search"}
                    value={search}
                    setValue={setSearch}
                    placeholder={"Recherchez votre pharmacie..."}
                    className={"grow"}/>
                    <Link className="text-pharmagency-white underline ml-4 text-center" to={"/admin/marques"}>
                        Voir les marques
                    </Link>
                </div>
            </div>
            <div className={clsx(
                "mt-8 mx-auto px-6",
                containerClass
            )}>
                {domains.map(
                    (v,index)=><DomainBlock {...v} handleDelete={handleDelete}/>
                )}
            </div>
        </div>
    )
}