import clsx from "clsx";
import CategoryBrandsPaginationButton from "./CategoryBrandsPaginationButton";

export default function CategoryBrandsPagination(props) {
    return (
        <div class="flex justify-center mt-4">
            <nav class="flex" aria-label="Pagination">
                <CategoryBrandsPaginationButton label="Précédent" locked={props.page <= 1} onClick={()=>{
                    if(props.page > 1){
                        props.setPage(props.page-1);
                    }
                }} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} className={clsx(
                    props.cssClasses.pagination_button,
                    props.cssClasses.button
                )} borderRadius={props.borderRadius}/>
                <span className={clsx(
                    "relative inline-flex items-center px-4 py-1 border text-sm font-medium",
                    props.cssClasses.pagination_index
                )}
                style={
                    {
                        "color":props.secondaryColor,
                    }
                }
                id="pagemarques-pagination-index">
                    {props.page}
                </span>
                <CategoryBrandsPaginationButton label="Suivant" onClick={()=>{
                    if(props.page + 1 <= props.max){
                        props.setPage(props.page+1);
                    }
                }} primaryColor={props.primaryColor} secondaryColor={props.secondaryColor} locked={props.page + 1 > props.max} className={clsx(
                    props.cssClasses.pagination_button,
                    props.cssClasses.button
                )} borderRadius={props.borderRadius}/>
            </nav>
        </div>

    )
}