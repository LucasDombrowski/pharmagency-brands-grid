import { useState } from "react";
import CategoryList from "./CategoryList";
import CategoryBrands from "./CategoryBrands";

export default function CategoryGrid(props){
    const categories = props.data.categories;
    const [category,setCategory] = useState(categories[0]);
    return (
        <div className="w-full">
            {props.params.displayCategories && <CategoryList categories={categories} category={category} setCategory={setCategory} params={props.params}/>}
            <CategoryBrands brands={props.params.displayCategories ? category.brands : props.data.all_brands} {...props.params}/>
        </div>
    )
}