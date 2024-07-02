import { Link } from "react-router-dom";
import Button from "../../../Button";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import { BASE_URL, colors } from "../../../../settings";
import axios from "axios";
import clsx from "clsx";

export default function DomainBlock({ id, name, domain, token, className, handleDelete }) {

    const [loading, setLoading] = useState(false);
    const [empty,setEmpty] = useState(false);

    async function checkCategories(){
        try{
            const response = await axios.get(`${BASE_URL}/clients/${id}`);
            if(response.data.categories.length===0){
                setEmpty(true);
            }
        } catch(err){
            console.log(err);
        }
    }

    async function deleteDomain() {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Supprimer le domaine ?");
        if (isConfirmed) {
            setLoading(true);
            handleDelete(id,setLoading);
        }
    }

    useEffect(()=>{
        checkCategories();
    },[]);

    return (
        <div className="w-full py-6 border-b border-pharmagency-light-grey">
            <div className="flex items-center justify-between mobile:flex-col">
                <div className="flex flex-col mobile:items-center mobile:text-center mobile:mb-8">
                    <Link to={`/admin/${id}`} className="font-medium text-20 transition-all hover:text-pharmagency-blue">{name}</Link>
                    <a className="font-light text-pharmagency-blue underline transition-all hover:text-pharmagency-cyan" href={`https://${domain}`} target="_blank">{domain}</a>
                </div>
                <div className="flex items-center">
                    <Link to={`/modifier/${token}`}>
                        <Button className={clsx(
                            "text-pharmagency-white transition-all mr-6 border hover:bg-pharmagency-white",
                            empty ? "bg-pharmagency-blue border-pharmagency-blue hover:text-pharmagency-blue" : "bg-pharmagency-cyan border-pharmagency-cyan hover:text-pharmagency-cyan"
                        )}>
                            {empty ? "Créer" : "Modifier"}
                        </Button>
                    </Link>
                    <Button className={"bg-pharmagency-red text-pharmagency-white border border-pharmagency-red hover:bg-pharmagency-white hover:text-pharmagency-red transition-all"} onClick={()=>{
                        if(!loading){
                            deleteDomain();
                        }
                    }}>
                        {loading ? <Circles
                            width={20}
                            height={20}
                            color={colors.white} />
                            : "Supprimer"}
                    </Button>
                </div>
            </div>
        </div>
    )
}