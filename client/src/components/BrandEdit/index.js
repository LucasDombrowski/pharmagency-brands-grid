import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../../data/globals";
import { useNavigate } from "react-router-dom";

export default function BrandEdit(props){
    const params = useParams();
    const [name,updateName] = useState("");
    const [url, updateUrl] = useState("");
    const navigate = useNavigate();

    async function getBrand(){
        try{
            const request = await axios.get(server +"/brands/" + params.id);
            updateName(request.data.name);
            updateUrl(request.data.png_url ? request.data.png_url : request.data.jpg_url);
        }catch(err){
            console.log(err);
        }
    }

    async function handleDelete(e){
        e.preventDefault();
        try{
            const request = await axios.delete(server + "/brands/" + params.id, {
                headers: {
                    "Authorization":"Bearer " + props.token
                }
            });
            navigate("/admin/brands");
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getBrand();
    },[]);

    async function handleSubmit(e){
        e.preventDefault();
        const data = {
            "name":name,
            "url":url,
            "validated":true
        };
        try{
            const request = await axios.post(server + "/brands/" + params.id + "?_method=PUT", data, {
                headers: {
                    "Authorization" : "Bearer " + props.token,
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                }
            });
            updateName(request.data.name);
            updateUrl(request.data.png_url ? request.data.png_url : request.data.jpg_url);
        } catch(err){
            console.log(err);
        }

    }

    return (
        <div className="max-w-[1100px] mx-auto min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center">
                    <div className="mr-16">
                        <div className="flex flex-col mb-6">
                            <label htmlFor="name">Nom</label>
                            <input type="text" name="name" id="name" value={name} className="border-b-2 border-black" onChange={(e)=>{
                                updateName(e.target.value);
                            }}/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="url">URL</label>
                            <input type="url" name="url" id="url" value={url} className="border-b-2 border-black min-w-[600px]" onChange={(e)=>{
                                updateUrl(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 mr-4">
                                Submit
                            </button>
                            <button type="button" onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-10">
                                Delete
                            </button>
                        </div>
                    </div>
                    <img src={url} alt={name} className="aspect-square object-cover border-black border-2"/>
                </div>
            </form>
        </div>
    )

}

