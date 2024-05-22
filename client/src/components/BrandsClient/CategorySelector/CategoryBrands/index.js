import BrandsGridItem from "../../BrandsGrid/BrandsGridItem";

export default function CategoryBrands(props){
    return (
        <div className="grid gap-4 grid-cols-8">
            {[...props.brands].reverse().map(
                v => <BrandsGridItem {...v} onClick={()=>{
                    props.deleteBrand(v);
                }}/>
            )}
        </div>
    )
}