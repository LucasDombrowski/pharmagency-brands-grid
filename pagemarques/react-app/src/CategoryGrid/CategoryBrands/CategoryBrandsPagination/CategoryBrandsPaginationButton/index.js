import clsx from "clsx";

export default function CategoryBrandsPaginationButton(props){
    return (
        <button type="button" class={
            clsx(
                "text-base m-2 font-medium px-3 py-1.5 border-none",
                "bg-[#F7F7F7]",
                props.locked ? "opacity-50" : "cursor-pointer hover:bg-[#4b4b4b20]",
                "transition-all pagemarques-pagination-button pagemarques-button",
                props.className
            )
        } onClick={props.onClick}
        style={
            {
                "borderRadius":props.borderRadius + "px",
                "outline": "none", // Remove default focus outline
                "boxShadow": "none" // Remove focus outline in some browsers
            }
        }>
            {props.label}
        </button>
    )
}