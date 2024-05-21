import { useState } from "react";
import AddCategory from "../../AddCategory";

export default function CategorySwitch(props){
    const categories = props.categories;
    const [newCategory, setNewCategory] = useState(false);

    return (
        <>
        <div className="flex items-center mb-6">
            <select
            onChange={(e)=>{
                props.onChange(categories[e.target.value]);
            }}
            className="border-black border-b-2 px-3 py-2 text-3xl bg-transparent mr-3">
                {categories.map(
                    (v, index) => <option value={index} selected={v.id == props.category.id}>{v.name}</option>
                )}
            </select>
            <button onClick={props.deleteCategory} className="font-bold text-red-600 text-xl">
                X
            </button>
            <button onClick={()=>{
                setNewCategory(true);
            }} className="font-bold text-3xl">
                +
            </button>
        </div>
        {newCategory && <AddCategory
        addCategory={(name)=>{
            setNewCategory(false);
            props.addCategory(name);
        }}/>}
        </>
    )
}