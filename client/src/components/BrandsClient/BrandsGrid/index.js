import axios from "axios";
import { useEffect, useState } from "react"
import { server } from "../../../data/globals";
import BrandsGridItem from "./BrandsGridItem";
import BrandsGridInput from "./BrandsGridInput";
import { ReactSortable } from "react-sortablejs";

export default function BrandsGrid(props){
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState(false);
    useEffect(()=>{
        getBrands();
    },[]);

    async function getBrands(query = ""){
        try{
            const request = await axios.get(server + "/brands?query=" + query + "&validated=1");
            setBrands(request.data);
        } catch(err){
            console.log(err);
        }
    }

    function brandNameExists(name){
        const request = axios.get(server + "/brands?query=" + name);
        return request.data.length > 0;
    }

    return (
        <div>
            <div>
                <BrandsGridInput
                onChange={(event)=>{
                    console.log(event.target.value);
                    getBrands(event.target.value);
                }}
                onSubmit={()=>{
                    if(brands.length > 0){
                        props.addBrand(brands[0]);
                    }
                }}/>
            </div>
        <ReactSortable 
        className="grid grid-cols-2 gap-2 mt-6"
        list={brands}
        setList={()=>{}}
        group={{
            name: "brands",
            put: false
        }}
        ghostClass="hidden"
        sort={false}
        onRemove={(evt)=>{
            const removedId = evt.item.getAttribute('data-id');
            const removedItem = brands.find((v)=>{
                return v.id == removedId;
            });
            props.addBrand(removedItem, evt.newDraggableIndex);
        }}>
        {brands.map(
            v => <BrandsGridItem {...v} onClick = {()=>{
                props.addBrand(v); 
            }}/>
        )}
        <div className="border-4 border-black aspect-square flex justify-center items-center" onClick={()=>{
            setNewBrand(true);
        }}>
            <div className="text-xl font-bold">
                Ajouter
            </div>
        </div>
        </ReactSortable>
        </div>
    )
}