import { ReactSortable } from "react-sortablejs";
import BrandsGridItem from "./BrandsGridItem";
import clsx from "clsx";
export default function Brands({ className, brands }) {
    return (
        <ReactSortable
            className={clsx(
                "grid grid-cols-2 grid-rows-5 gap-2 overflow-hidden",
                className
            )}
            list={brands}
            setList={() => { }}
            group={{
                name: "brands",
                put: false
            }}
            ghostClass="hidden"
            sort={false}
            onRemove={(evt) => {
                const removedId = evt.item.getAttribute('data-id');
                const removedItem = brands.find((v) => {
                    return v.id == removedId;
                });
                //props.addBrand(removedItem, evt.newDraggableIndex);
            }}>
            {brands.map(
                v => <BrandsGridItem {...v}/>
            )}
        </ReactSortable>
    )
}