import { useEffect, useRef } from "react";
import BrandsGridItem from "../../BrandsGrid/BrandsGridItem";
import Sortable from "sortablejs";

export default function CategoryBrands(props){
    const ref = useRef();
    useEffect(() => {
        if (ref.current) {
          Sortable.create(ref.current, {
            animation: 150,
            handle: '.handle',
            onEnd: (evt) => {
                const updatedCategory = {
                    ...props.category,
                    brands: moveBrand(evt.oldDraggableIndex, evt.newDraggableIndex)
                };
                console.log(updatedCategory);
                props.setCategory(updatedCategory);
            },
          });
        }
      },[]);

    function moveBrand(oldIndex, newIndex){
        if (oldIndex !== newIndex) {
            const newOrder = [...props.brands];
            const value = newOrder.splice(oldIndex,1)[0];
            newOrder.splice(newIndex,0,value);
            return newOrder;
        } else {
            return props.brands;
        }
    }
    return (
        <div className="grid gap-4 grid-cols-5" ref={ref}>
            {[...props.brands].map(
                v => <BrandsGridItem {...v} onClick={()=>{
                    props.deleteBrand(v);
                }}
                className="handle"/>
            )}
        </div>
    )
}