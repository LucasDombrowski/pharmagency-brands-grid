import { INDEX_URL } from "../../../../settings";

export default function WhiteLogo({className}){
    return (
        <div className={className}>
            <a className="w-full block" href={INDEX_URL} target="_blank">
                <img src="/images/logo-pharmagency-white.png" alt="Logo Pharmagency" className={"w-full"}/>
            </a>
        </div>
    )
}