import { useEffect, useState } from "react";
import CategoryBrandsItem from "./CategoryBrandsItem";
import CategoryBrandsPagination from "./CategoryBrandsPagination";
import LazyCategoryBrandsItem from "./CategoryBrandsItem/LazyCategoryBrandsItem";

export default function CategoryBrands(props){
    const [page,setPage] = useState(1);
    const [brands,setBrands] = useState([]);

    function getCurrentPage(){
        const allBrands = props.brands;
        const lastIndex = page*props.paginationLimit;
        const firstIndex = lastIndex - props.paginationLimit;
        return [...allBrands.slice(firstIndex,lastIndex)];
    }


    useEffect(()=>{
        console.log(props.loading);
        if(props.loading == "pagination"){
            setBrands(getCurrentPage());
        } else {
            setBrands(props.brands);
        }
    },[page]);
    

    return (
        <>
        <div className="w-full grid gap-4 mx-auto" style={{
            "gridTemplateColumns":`repeat(${props.columns},1fr)`,
            "maxWidth": `${props.columns * props.imageSize}px`
        }}>
            {brands.map(
                v=><>
                {props.loading=="lazy_loading" ? <LazyCategoryBrandsItem {...v}/> : <CategoryBrandsItem {...v}/>}
                </>
            )}
        </div>
        {props.loading=="pagination" &&  <CategoryBrandsPagination page={page} setPage={setPage} {...props} max={Math.floor(props.brands.length/props.paginationLimit) + 1}/>}
        </>
    )
}