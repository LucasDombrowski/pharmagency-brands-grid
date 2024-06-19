import { Link } from "react-router-dom";
import Button from "../../../Button";
import { useState } from "react";
import { Circles } from "react-loader-spinner";
import { colors } from "../../../../settings";

export default function DomainBlock({ id, name, domain, token, className, handleDelete }) {

    const [loading, setLoading] = useState(false);
    async function deleteDomain() {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Supprimer le domaine ?");
        if (isConfirmed) {
            setLoading(true);
            handleDelete(id,setLoading);
        }
    }

    return (
        <div className="w-full py-6 border-b border-pharmagency-light-grey">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-medium text-20">{name}</span>
                    <span className="font-light text-pharmagency-blue">{domain}</span>
                </div>
                <div className="flex items-center">
                    <Link to={`/edit/${token}`}>
                        <Button className={"bg-pharmagency-cyan text-pharmagency-white transition-all hover:bg-pharmagency-blue mr-6 border border-pharmagency-cyan hover:border-pharmagency-blue"}>
                            Modifier
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