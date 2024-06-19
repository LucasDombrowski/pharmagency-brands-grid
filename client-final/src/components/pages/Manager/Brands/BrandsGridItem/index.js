import clsx from "clsx";

export default function BrandsGridItem(props){
    return (
        <div className={clsx(
            props.className
        )} data-id={props.id}>
            <img src={props.png_url ? props.png_url : props.jpg_url} alt={props.name} className="w-full h-full object-contain"/>
        </div>
    )
}