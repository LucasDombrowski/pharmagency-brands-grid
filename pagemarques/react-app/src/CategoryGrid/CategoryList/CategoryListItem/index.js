import clsx from "clsx";

export default function CategoryListItem(props){
    return (
        <div className={clsx(
            "text-2xl mx-4",
            !props.active && "opacity-50 cursor-pointer",
            "transition-all hover:opacity-100 pagemarques-category-list-item",
            props.cssClasses.category_label
        )}
        onClick={props.onClick}
        style={{
            "color":props.primaryColor
        }}
        >
            {props.name}
        </div>
    )
}