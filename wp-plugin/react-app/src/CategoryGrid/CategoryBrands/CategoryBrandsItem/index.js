export default function CategoryBrandsItem(props){
    return (
        <div>
            <img src={props.png_url ? props.png_url : props.jpg_url} alt={props.name} className="w-full aspect-square object-contain" loading={props.lazy && "lazy"}/>
        </div>
    )
}