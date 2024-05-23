import BrandsGridItem from "../../BrandsGrid/BrandsGridItem";

export default function CategoryBrands(props){
    return (
        <div className="grid gap-4 grid-cols-5">
            {[...props.brands].map(
                v => <BrandsGridItem {...v} onClick={()=>{
                    props.deleteBrand(v);
                }}/>
            )}
        </div>
    )
}