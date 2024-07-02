import { useState } from "react";
import TextInput from "../forms/inputs/TextInput";
import Button from "../Button";
import { Circles } from "react-loader-spinner";
import { colors } from "../../settings";
import WhiteLogo from "../images/logos/WhiteLogo";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function ClientForm({ title, client, onSubmit, loading = false, error}) {
    const labelClass = "text-24 mb-2 block";
    const [name,setName] = useState(client.name);
    const [domain,setDomain] = useState(client.domain);
    const [departmentCode,setDepartmentCode] = useState(client.departmentCode);
    return (
        <div className="w-dvw h-dvh py-10 px-6 relative tablet:pt-32">
            <div className="w-full bg-gradient-to-r from-pharmagency-blue to-pharmagency-cyan py-6 px-8 flex items-center justify-between absolute top-0 left-0 rounded-b-3xl">
                <div className="mr-8">
                    <WhiteLogo className={"max-w-[100px] mobile:max-w-[60px]"} />
                </div>
                <div className={clsx(
                    "w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[800px] small-computer:static small-computer:translate-x-0 small-computer:translate-y-0 flex items-center"
                )}>
                    <h1 className="text-[2rem] mobile:text-24 text-center font-medium text-pharmagency-white w-full">{title}</h1>
                </div>
                <Link className="ml-8" to={"/admin"}>
                    <Button className={"text-pharmagency-white border border-pharmagency-white text-14 transition-all hover:bg-pharmagency-white hover:text-pharmagency-cyan font-medium whitespace-nowrap"}>
                        Retour
                    </Button>
                </Link>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                <form className="flex items-center justify-center px-6 tablet:flex-col-reverse" onSubmit={(e)=>{
                    if(!loading){
                        onSubmit(e,name,domain,departmentCode);
                    }
                }}>
                    <div className="w-full max-w-[550px] flex flex-col">
                        <div className="mb-8">
                            <label className={labelClass}>Nom</label>
                            <TextInput type={"text"} required className={"border-2 border-pharmagency-light-grey max-w-[550px] w-full"} backgroundClass="bg-pharmagency-lighter-grey" placeholder={"Nom de l'entreprise"} setValue={setName} value={name}/>
                        </div>
                        <div className="mb-8">
                            <label className={labelClass}>Domaine</label>
                            <TextInput type={"text"} required className={"border-2 border-pharmagency-light-grey max-w-[550px] w-full"} backgroundClass="bg-pharmagency-lighter-grey" placeholder={"exemple.com"} setValue={setDomain} value={domain}/>
                        </div>
                        <div>
                            <label className={labelClass}>Numéro de département</label>
                            <TextInput type={"number"} required className={"border-2 border-pharmagency-light-grey max-w-[550px] w-full"} backgroundClass="bg-pharmagency-lighter-grey" placeholder={"XX"} setValue={setDepartmentCode} value={departmentCode} min={0}/>
                        </div>
                        {error && <p className="text-pharmagency-red mt-8 text-center">{error}</p>}
                        <Button type="submit" className={"bg-pharmagency-cyan text-pharmagency-white transition-all hover:bg-pharmagency-blue mt-8 w-fit self-center"}>
                        {loading ? <Circles
                            width={20}
                            height={20}
                            color={colors.white} />
                            : "Valider"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
            )
}