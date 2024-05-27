import clsx from "clsx";

export default function BrandsGridItem(props){
    return (
        <div onClick={props.onClick && props.onClick} className={clsx(
            "border-4 border-black",
            props.className
        )} data-id={props.id}>
            <img src={props.png_url ? props.png_url : props.jpg_url} alt={props.name} className="w-full aspect-square object-cover"/>
        </div>
    )
}