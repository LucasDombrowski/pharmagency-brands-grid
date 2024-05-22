import { useState } from "react"

export default function AddBrand(props){
    const [name,updateName] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        props.addNewBrand(name);
    }

    return (
        <div className="fixed top-0 left-0 w-dvw h-dvh flex flex-col justify-center items-center z-50 backdrop-blur">
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <label htmlFor="category-name" className="text-3xl font-bold mb-6">Nom de la marque</label>
                <input 
                onChange={(e)=>{
                    updateName(e.target.value);
                }}
                value={name}
                className="border-black border-2 outline-none text-2xl rounded-2xl px-3 py-2"
                id="category-name"
                required/>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl mt-8">
                    Valider
                </button>
            </form>
        </div>
    )
}