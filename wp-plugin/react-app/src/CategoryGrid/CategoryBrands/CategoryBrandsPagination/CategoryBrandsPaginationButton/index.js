import clsx from "clsx";

export default function CategoryBrandsPaginationButton(props){
    return (
        <button type="button" class={
            clsx(
                "relative inline-flex items-center px-4 py-1 border text-sm font-medium",
                props.locked ? "opacity-50" : "cursor-pointer",
                "pagemarques-pagination-button"
            )
        } onClick={props.onClick}
        style={
            {
                "background":props.secondaryColor,
                "color":props.primaryColor,
                "borderColor":props.primaryColor
            }
        }>
            {props.label}
        </button>
    )
}