import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BrandsGrid from "./BrandsGrid";
import CategorySelector from "./CategorySelector";
import axios from "axios";
import { server } from "../../data/globals";
import AddCategory from "./AddCategory";

export default function BrandsClient(props){
    const navigate = useNavigate();
    const params = useParams();
    const [client, setClient] = useState(null);
    const [categories, setCategories] = useState(null);
    const [category, setCategory] = useState(null);

    useEffect(()=>{
        checkToken();
    },[]);

    async function checkToken(){
        try {
            const request = await axios.get(server + "/clients/token/" + params.token);
            setClient({
                id: request.data.id,
                token: request.data.token
            });
            setCategories(request.data.categories);
            setCategory(request.data.categories[0]);
        } catch(err){
            console.log(err);
            navigate("/");
        }
    }

    function uniqueBrand(brand){
        return category.brands.filter((v)=>{
            return v.id === brand.id
        }).length === 0;
    }

    function uniqueCategory(name){
        return categories.filter((v)=>{
            return v.name === name;
        }).length === 0;
    }

    async function handleClick(){
        for await(let singleCategory of categories){
            if(singleCategory.brands.length > 0){
                const data = {
                    "client_id":client.id,
                    "client_token":client.token,
                    "name":singleCategory.name,
                    "brands":singleCategory.brands.map((v)=>{
                        return {
                            "name":v.name,
                            "url": (v.png_url ? v.png_url : v.jpg_url).replace(new RegExp(" ","g"), "%20")
                        }
                    })
                }
                console.log(data);
                if(!singleCategory.new){
                    try{
                        const request = await axios.post(server + "/categories/" + singleCategory.id + "?_method=PUT",data, {
                            headers : {
                                "Content-Type" : "application/json",
                                "Accept" : "application/json"
                            }
                        })
                    } catch(err){
                        console.log(err);
                    }
                } else {
                    try{
                        const request = await axios.post(server + "/categories", data, {
                            headers : {
                                "Content-Type" : "application/json",
                                "Accept" : "application/json"
                            }
                        });
                    } catch(err){
                        console.log(err);
                    }
                }
            }
        }
        checkToken();
    }

    async function handleDelete(){
        const data = {
            "client_id":client.id,
            "client_token":client.token
        };
        try{
            const request = await axios.post(server + "/categories/" + category.id + "?_method=DELETE",data,{
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            const updatedCategories = categories.filter((v)=>{
                return v.id !== category.id;
            })
            setCategories(updatedCategories);
            setCategory(updatedCategories[0]);
        } catch(err){
            console.log(err);
        }
    }

    return (
        <div className="w-full max-w-[1920x] mx-auto">
            {(categories && category) ? <div className="w-full">
                <div className="flex min-h-screen w-full">
                    <div className="grow p-10 min-h-full flex flex-col w-full">
                        <div className="grow">
                            <CategorySelector
                            categories={categories.map((v)=>{
                                return {...v, new: false}
                            })}
                            category = {category}
                            setCategory = {(category)=>{
                                setCategory(category);
                            }}
                            deleteBrand = {(brand)=>{
                                const updatedCategory = {
                                    ...category,
                                    brands: category.brands.filter((v)=>{
                                        return v.id !== brand.id
                                    })
                                };
                                setCategory(updatedCategory);
                                setCategories(categories.map((v)=>{
                                    if(v.id === updatedCategory.id){
                                        return updatedCategory
                                    } else {
                                        return v
                                    }
                                }));

                            }}
                            deleteCategory = {handleDelete}
                            addCategory = {(name)=>{
                                if(uniqueCategory(name)){
                                    const updatedCategories = [{
                                        "name":name,
                                        "brands":[],
                                        "new":true
                                    }, ...categories, ];
                                    setCategories(updatedCategories);
                                    setCategory(updatedCategories[0]);
                                }
                            }}/>
                        </div>   
                        <div>
                            <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sauvegarder</button>
                        </div>
                    </div>
                    <div className="min-w-[20%] w-[20%] border-l-4 border-l-black px-6 py-10 ml-10 min-h-full">
                        <BrandsGrid
                        addBrand = {(brand)=>{
                            if(uniqueBrand(brand)){
                                const updatedCategory = {
                                    ...category,
                                    brands: [...category.brands, brand]
                                };
                                setCategory(updatedCategory);
                                setCategories(categories.map((v)=>{
                                    if(v.id === updatedCategory.id){
                                        return updatedCategory
                                    } else {
                                        return v
                                    }
                                }));
                            }
                        }}/>
                    </div>
                </div>
            </div>
            : <AddCategory
            addCategory={(name)=>{
                const updatedCategories = [
                    {
                        "name":name,
                        "brands":[],
                        "new":true
                    }
                ];
                setCategories(updatedCategories);
                setCategory(updatedCategories[0]);
            }}/>} 
        </div>
    )
}