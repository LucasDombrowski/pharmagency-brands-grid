import clsx from "clsx";

export default function CategoryListItem(props){
    return (
        <div className={clsx(
            "text-base m-2 font-medium px-3 py-1.5",
            !props.active && "cursor-pointer bg-[#F7F7F7] hover:bg-[#4b4b4b20]",
            "transition-all pagemarques-category-list-item pagemarques-button",
            props.cssClasses.category_label,
            props.cssClasses.button
        )}
        onClick={props.onClick}
        style={{
            "color":props.active && props.primaryColor,
            "background":props.active && props.secondaryColor,
            "borderRadius":`${props.borderRadius}px`
        }}
        >
            {props.name}
        </div>
    )
}