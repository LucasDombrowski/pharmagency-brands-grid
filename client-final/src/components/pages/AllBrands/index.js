import WhiteLogo from "../../images/logos/WhiteLogo";
import clsx from "clsx";
import TextInput from "../../forms/inputs/TextInput";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../settings";
import DeleteTrigger from "../../DeleteTrigger";
import Button from "../../Button";

export default function AllBrands({ token }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(null);
    const [brands, setBrands] = useState([]);
    const [max,setMax] = useState(false);

    const containerClass = "max-w-[1200px]";
    const gridContainer = useRef(null);

    async function handleDelete(id) {
        try {
            await axios.delete(`${BASE_URL}/brands/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if(page){
                resetPages();
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function getBrands() {
        const limit = page===1 ? 39 : 40;
        try {
            const response = await axios.get(`${BASE_URL}/brands?limit=${limit}&query=${search}&page=${page}`);
            const data = page===1 ? response.data.data : [...brands,...response.data.data];
            setBrands(data);
            if(!response.data.next_page_url){
               setMax(true); 
            } else {
                setMax(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    function resetPages(){
        if(page===1){
            getBrands();
        } else {
            setPage(1);
        }
    }

    useEffect(() => {
        resetPages();
    }, [search]);

    useEffect(()=>{
        if(page){
            getBrands();
        }
    },[page]);

    return (
        <div className="w-full">
            <div className="w-full bg-gradient-to-r from-pharmagency-blue to-pharmagency-cyan py-6 px-8 sticky top-0 left-0 flex items-center z-50 justify-between rounded-b-3xl">
                <div className="mr-8">
                    <WhiteLogo className={"max-w-[100px] mobile:max-w-[60px]"} />
                </div>
                <div className={clsx(
                    "w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[800px] small-computer:static small-computer:translate-x-0 small-computer:translate-y-0 flex items-center"
                )}>
                    <TextInput
                        type={"search"}
                        value={search}
                        setValue={setSearch}
                        placeholder={"Recherchez une marque..."}
                        className={"grow"} />
                </div>
                <Link className="ml-8" to={"/admin"}>
                    <Button className={"text-pharmagency-white border border-pharmagency-white text-14 transition-all hover:bg-pharmagency-white hover:text-pharmagency-cyan font-medium whitespace-nowrap"}>
                        Voir les domaines
                    </Button>
                </Link>
            </div>
            <div className={clsx(
                "mt-8 mx-auto px-6",
                containerClass
            )}>
                <div className="grid grid-cols-5 gap-10 tablet:grid-cols-4 mobile:!grid-cols-2" ref={gridContainer}>
                    <div className="border-2 border-pharmagency-blue transition-all scale-100 hover:scale-105 aspect-square">
                        <Link className="w-full h-full flex items-center justify-center text-center p-3 font-medium" to={"/admin/marques/ajouter"}>
                            Ajouter une marque
                        </Link>
                    </div>
                    {brands.map((v, index) => (
                        <div key={v.id} className="opacity-50 transition-all hover:opacity-100 scale-100 hover:scale-105 tablet:opacity-100 relative border-2 border-pharmagency-blue">
                            <Link to={`/admin/marques/${v.id}`} className="block w-full">
                                <img alt={v.name} src={v.png_url ? v.png_url : v.jpg_url} className="w-full aspect-square object-contain" />
                            </Link>
                            <DeleteTrigger className={"absolute w-[24px] top-0 right-0 translate-x-1/2 -translate-y-1/2"} message={`Voulez-vous vraiment supprimer définitivement la marque "${v.name}" ?`} onClick={() => {
                                handleDelete(v.id);
                            }} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center py-4">
                {!max && <Button onClick={()=>{
                    setPage(page+1);
                }} className={"text-pharmagency-cyan underline transition-all hover:text-pharmagency-blue"}>Voir plus</Button>}
            </div>
        </div>
    );
}
