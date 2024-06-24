import clsx from "clsx";

export default function BrandsGridItem(props){
    return (
        <div className={clsx(
            "w-full h-full flex flex-col",
            props.className
        )}>
            <img src={props.png_url ? props.png_url : props.jpg_url} alt={props.name} className="w-full h-full object-contain cursor-move"/>
            {props.index && <span className="font-light self-end">{props.index}</span>}
        </div>
    )
}