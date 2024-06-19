import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, INDEX_URL } from "../../../settings";
import clsx from "clsx";
import WhiteLogo from "../../images/logos/WhiteLogo";
import Dropdown from "../../forms/inputs/Dropdown";
import TextInput from "../../forms/inputs/TextInput";
import Brands from "./Brands";
import CategoriesList from "./CategoriesList";

export default function Manager({ userToken }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [brands, setBrands] = useState([]);
    const [useCategories, setUseCategories] = useState(false);
    const [options,setOptions] = useState([]);
    const [category,setCategory] = useState(null);

    async function getClient() {
        try {
            const response = await axios.get(`${BASE_URL}/clients/token/${token}`);
            console.log(response.data);
            setClient(response.data);
        } catch (err) {
            console.log(err);
            navigate(INDEX_URL);
        }
    }

    async function getBrands() {
        try {
            const response = await axios.get(`${BASE_URL}/brands?query=${search}&limit=10&code=${client.departmentCode}`);
            setBrands(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    function getOptions(){
        const labels = ["Aromathérapie","Homéopathie","Matériel médical","Orthopédie","Parapharmacie"];
        var count = 0;
        return labels.map((v)=>{
            const data = {
                brands: [],
                name: v,
                new: true
            };
            const test = testCategoryName(v);
            data.id = !test ? getNewCategoryId() + count : test.id;
            count++;
            return {
                label: v,
                value: data
            }
        }).filter((v)=>{
            return !testCategoryName(v.value.name);
        })
    }

    function testCategoryName(name){
        const filter = [...categories].find((v)=>{
            return v.name === name
        });
        return (filter && filter!=undefined) ? filter : null;
    }

    function getNewCategoryId() {
        if (categories.length === 0) {
            return 1;
        }
        return Math.max(...categories.map(({ id }) => id)) + 1;
    }


    useEffect(() => {
        getClient();
    }, [token]);

    useEffect(() => {
        if (client) {
            setCategories(client.categories);
        }
    }, [client]);

    useEffect(() => {
        if(client){
            getBrands();
        }
    }, [search, client]);

    useEffect(()=>{
        if(categories.length > 0 && !testCategoryName(placeholderCategoryName)){
            setUseCategories(true);
        }
        setOptions(getOptions());
    },[categories]);

    const sideContainerClass = "w-[360px] h-full px-8 py-6";
    const placeholderCategoryName = "Sans catégories"


    if (client) {
        return (
            <div className="w-dvw h-dvh">
                <div className="w-full h-full flex">
                    <div className={clsx(
                        sideContainerClass,
                        "bg-gradient-to-b from-pharmagency-cyan to-pharmagency-blue rounded-r-3xl text-pharmagency-white"
                    )}>
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="min-h-[2rem]">
                                    {userToken && <button className="text-24 font-medium" onClick={() => {
                                        navigate(-1);
                                    }}>&lt; Retour</button>}
                                </div>
                                <h1 className="text-24 font-medium mt-12">Vous modifiez actuellement :</h1>
                                <div className="flex flex-col mt-8">
                                    <span className="text-20 font-medium">{client.name}</span>
                                    <span className="font-light underline">{client.domain}</span>
                                </div>
                            </div>
                            <div>
                                <a target="_blank">
                                    <div className="flex flex-col items-center">
                                        <WhiteLogo className={"max-w-[150px] mb-4"} />
                                        <span className="underline font-medium text-20">Signaler un problème</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="grow h-full px-8 py-8">
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="grow">
                                <div>
                                    <div className="flex items-center">
                                        <h2 className="text-24 font-medium">Ajouter une nouvelle catégorie :</h2>
                                        <Dropdown options={options}
                                            placeholder={"Sélectionner..."}
                                            className={"min-w-[300px] ml-8"}
                                            onChange={(v)=>{
                                                setCategories([...categories,v]);
                                                setCategory(v);
                                            }}/>
                                    </div>
                                    <button className="font-light text-pharmagency-blue underline mt-4">Je ne souhaite pas utiliser de catégories</button>
                                </div>
                                <CategoriesList className={"mt-8"} useCategories={useCategories} categories={categories} category={category} setCategory={setCategory}/>
                            </div>
                            <div className="w-full flex justify-center">
                                <a className="text-20 font-medium underline" href="https://www.pharmagency.fr/" target="_blank ">pharmagency.fr</a>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(
                        sideContainerClass,
                        "shadow-2xl rounded-l-3xl"
                    )}>
                        <div className="h-full flex flex-col">
                            <div className="grow flex flex-col overflow-hidden">
                                <h2 className="text-24 font-medium">Ajoutez vos marques</h2>
                                <TextInput type={"search"} value={search} setValue={setSearch} placeholder={"Recherche..."} className={"bg-[#F7F7F7] text-16 my-8"} />
                                <Brands brands={brands} className={"grow"}/>
                            </div>
                            <div className="w-full flex justify-center mt-8">
                                <a className="text-20 font-medium underline text-pharmagency-cyan">Une marque manquante ?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
};