import { useEffect, useRef } from "react";
import BrandsGridItem from "../../BrandsGrid/BrandsGridItem";
import Sortable from "sortablejs";
import { ReactSortable } from "react-sortablejs";

export default function CategoryBrands(props){
    const ref = useRef();
    return (
        <ReactSortable
        list={props.category.brands}
        setList={(newState) => {
            const updatedCategory = {
                ...props.category,
                "brands":newState
            };
            props.setCategory(updatedCategory);
            props.setCategories([...props.categories].map((v)=>{
                if(v.id===updatedCategory.id){
                    return updatedCategory;
                } else {
                    return v;
                }
            }))
        }}
        className="grid gap-4 grid-cols-5"
        animation={150}
        group={{
            name:"brands",
            pull: false
        }}>
            {[...props.category.brands].map(
                v => <BrandsGridItem {...v} onClick={()=>{
                    props.deleteBrand(v);
                }}
                className="handle"/>
            )}
        </ReactSortable>
    )
}