import { Link } from "react-router-dom";

export default function ClientsManagerSection(props){
    return (
        <div className="w-full flex justify-between items-center my-8">
            <div>
                <h3 className="text-2xl font-bold">{props.name}</h3>
                <h4 className="text-xl italic">{props.domain}</h4>
            </div>
            <Link to={"/" + props.token} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Gérer
            </Link>
        </div>
    )
}