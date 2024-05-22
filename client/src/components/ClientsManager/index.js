import axios from "axios";
import { useEffect, useState } from "react"
import { server } from "../../data/globals";
import ClientsManagerSection from "./ClientsManagerSection";

export default function ClientsManager(props){
    const [clients, setClients] = useState([]);
    async function getClients(query = ""){
        try{    
            const request = await axios.get(server + "/clients?query=" + query, {
                headers: {
                    "Accept": "application/json",
                    "Authorization" : "Bearer " + props.token
                }
            });
            console.log(request);
            setClients(request.data);
        } catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getClients();
    },[]);
    return (
        <div className="max-w-[1100px] mx-auto">
            <input type="search" name="query" id="query" className="w-full px-3 py-2 text-xl outline-none border-b-2 border-black" placeholder="Rechercher..." onChange={(e)=>{
                getClients(e.target.value);
            }}/>
            {clients.map(
                v => <ClientsManagerSection {...v}/>
            )}
        </div>
    )
}