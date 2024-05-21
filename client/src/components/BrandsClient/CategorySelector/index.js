import { useState } from "react";
import CategorySwitch from "./CategorySwitch";
import CategoryBrands from "./CategoryBrands";

export default function CategorySelector(props){
    return (
        <div>
            <CategorySwitch
            categories={props.categories}
            onChange = {(category)=>{
                props.setCategory(category);
            }}
            deleteCategory = {props.deleteCategory}
            addCategory={props.addCategory}
            category={props.category}/>
            <CategoryBrands
            brands={props.category.brands}
            deleteBrand={props.deleteBrand}/>
        </div>
    )
}