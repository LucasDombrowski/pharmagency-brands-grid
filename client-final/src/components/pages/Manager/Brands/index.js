import { ReactSortable } from "react-sortablejs";
import BrandsGridItem from "./BrandsGridItem";
import clsx from "clsx";
export default function Brands({ className, brands, addBrand }) {
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
                console.log(evt.item);
                const removedItem = brands.find((v) => {
                    return v.id == removedId;
                });
                addBrand(removedItem, evt.newDraggableIndex);
            }}>
            {brands.map(
                (v,index) => <div onClick={()=>{
                    addBrand(v);
                }} data-id={v.id} key={v.id}><BrandsGridItem {...v} key={index}/></div>
            )}
        </ReactSortable>
    )
}