import clsx from "clsx";
import WhiteLogo from "../../images/logos/WhiteLogo";
import TextInput from "../../forms/inputs/TextInput";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../settings";
import DomainBlock from "./DomainBlock";
import { Link } from "react-router-dom";
import Button from "../../Button";

export default function Admin({ token }) {
    const [search, setSearch] = useState("");
    const [domains, setDomains] = useState([]);
    const [page,setPage] = useState(null);
    const [max,setMax] = useState(false);

    async function getDomains() {
        try {
            const response = await axios.get(`${BASE_URL}/clients?query=${search}&limit=15&page=${page}`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = page===1 ? response.data.data : [...domains,...response.data.data];
            if(!response.data.next_page_url){
                setMax(true);
            } else {
                setMax(false);
            }
            setDomains(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(page===1){
            getDomains();
        } else {
            setPage(1);
        }
    }, [search]);

    useEffect(()=>{
        if(page){
            getDomains();
        }
    },[page]);

    const containerClass = "max-w-[1200px]";

    async function handleDelete(id, setLoading) {
        try {
            await axios.delete(`${BASE_URL}/clients/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if(page===1){
                getDomains();
            } else {
                setPage(1);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="w-full">
            <div className="w-full bg-gradient-to-r from-pharmagency-blue to-pharmagency-cyan py-6 px-8 sticky top-0 left-0 flex items-center justify-between rounded-b-3xl">
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
                        placeholder={"Recherchez votre pharmacie..."}
                        className={"grow"} />
                </div>
                <Link className="ml-8" to={"/admin/marques"}>
                    <Button className={"text-pharmagency-white border border-pharmagency-white text-14 transition-all hover:bg-pharmagency-white hover:text-pharmagency-cyan font-medium whitespace-nowrap"}>
                        Voir les marques
                    </Button>
                </Link>
            </div>
            <div className={clsx(
                "mt-8 mx-auto px-6",
                containerClass
            )}>
                {domains.map(
                    (v, index) => <DomainBlock {...v} handleDelete={handleDelete} />
                )}
            </div>
            <div className="flex justify-center items-center py-4">
                {!max && <Button onClick={()=>{
                    setPage(page+1);
                }} className={"text-pharmagency-cyan underline transition-all hover:text-pharmagency-blue"}>Voir plus</Button>}
            </div>
        </div>
    )
}