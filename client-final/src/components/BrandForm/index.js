import { useState } from "react";
import TextInput from "../forms/inputs/TextInput";
import Button from "../Button";
import { Circles } from "react-loader-spinner";
import { colors } from "../../settings";
import WhiteLogo from "../images/logos/WhiteLogo";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function BrandForm({ title, brand, onSubmit, loading = false, error}) {
    const labelClass = "text-24 mb-2 block";
    const [name,setName] = useState(brand.name);
    const [url,setUrl] = useState(brand.png_url ? brand.png_url : brand.jpg_url)
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
                <Link className="ml-8" to={"/admin/marques"}>
                    <Button className={"text-pharmagency-white border border-pharmagency-white text-14 transition-all hover:bg-pharmagency-white hover:text-pharmagency-cyan font-medium whitespace-nowrap"}>
                        Retour
                    </Button>
                </Link>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full tablet:static tablet:translate-x-0 tablet:translate-y-0 tablet:mt-16">
                <form className="flex items-center justify-center px-6 tablet:flex-col-reverse" onSubmit={(e)=>{
                    if(!loading){
                        onSubmit(e,name,url);
                    }
                }}>
                    <div className="w-full max-w-[550px] flex flex-col">
                        <div className="mb-8">
                            <label className={labelClass}>Nom de la marque</label>
                            <TextInput type={"text"} required className={"border-2 border-pharmagency-light-grey max-w-[550px] w-full"} backgroundClass="bg-pharmagency-lighter-grey" placeholder={"Nom de la marque"} setValue={setName} value={name}/>
                        </div>
                        <div>
                            <label className={labelClass}>URL</label>
                            <TextInput type={"url"} required className={"border-2 border-pharmagency-light-grey max-w-[550px] w-full"} backgroundClass="bg-pharmagency-lighter-grey" placeholder={"URL"} setValue={setUrl} value={url}/>
                        </div>
                        {error && <p className="text-pharmagency-red mt-8 tablet:text-center">{error}</p>}
                        <Button type="submit" className={"bg-pharmagency-cyan text-pharmagency-white transition-all hover:bg-pharmagency-blue mt-8 w-fit tablet:self-center"}>
                        {loading ? <Circles
                            width={20}
                            height={20}
                            color={colors.white} />
                            : "Valider"}
                        </Button>
                    </div>
                    <div className="max-w-[300px] overflow-hidden rounded-3xl shadow-2xl ml-32 tablet:ml-0 tablet:mb-16 tablet:max-w-[250px]">
                        <img src={url} alt="Logo" className="w-full aspect-square object-cover"/>
                    </div>
                </form>
            </div>
        </div>
            )
}