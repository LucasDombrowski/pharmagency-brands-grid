import { ReactSortable } from "react-sortablejs";
import BrandsGridItem from "./BrandsGridItem";
import clsx from "clsx";
import { useRef } from "react";
import usePreventDragOnHorizontalScroll from "../../../../helpers/usePreventDragOnHorizontalScroll";

export default function Brands({ className, brands, addBrand, scroll = false, scrollContainerClassName}) {
    const containerRef = useRef();
    const touchStartRef = usePreventDragOnHorizontalScroll(containerRef);

    const SortableComponent = () => (
        <ReactSortable
            className={clsx(
                "grid grid-cols-2 grid-rows-5 gap-2",
                className,
                !scroll && "overflow-hidden"
            )}
            list={brands}
            setList={() => { }}
            group={{
                name: "brands",
                put: false
            }}
            ghostClass={!scroll ? "hidden" : ""}
            sort={false}
            onRemove={(evt) => {
                const removedId = evt.item.getAttribute('data-id');
                const removedItem = brands.find((v) => {
                    return v.id == removedId;
                });
                addBrand(removedItem, evt.newDraggableIndex);
            }}>
            {brands.map(
                (v, index) => <div onClick={() => {
                    addBrand(v);
                }} data-id={v.id} key={v.id}><BrandsGridItem {...v} key={index} /></div>
            )}
        </ReactSortable>
    );

    if (scroll) {
        return (
            <div ref={containerRef} className={scrollContainerClassName}>
                <SortableComponent/>
            </div>
        );
    } else {
        return <SortableComponent/>;
    }
}
