export default function BrandsGridItem(props){
    return (
        <div onClick={props.onClick && props.onClick} className="border-4 border-black">
            <img src={props.png_url ? props.png_url : props.jpg_url} alt={props.name} className="w-full aspect-square"/>
        </div>
    )
}