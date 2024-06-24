import { useEffect, useRef } from "react";
import BrandsGridItem from "../Brands/BrandsGridItem";
import { ReactSortable } from "react-sortablejs";
import clsx from "clsx";
import DeleteTrigger from "../../../DeleteTrigger";
import usePreventDragOnScroll from "../../../../helpers/usePreventDragOnScroll";

export default function CategoryBrands({ setCategory, category, categories, setCategories, deleteBrand, className, setEdits }) {
    const containerRef = useRef();
    usePreventDragOnScroll(containerRef);

    return (
        <div className={clsx(className, "relative")} ref={containerRef}>
            <ReactSortable
                list={category.brands}
                setList={(newState) => {
                    if (!arraysAreEqual(newState, category.brands)) {
                        const updatedCategory = {
                            ...category,
                            "brands": newState
                        };
                        setCategory(updatedCategory);
                        setCategories([...categories].map((v) => {
                            if (v.id === updatedCategory.id) {
                                return updatedCategory;
                            } else {
                                return v;
                            }
                        }));
                        setEdits(true);
                    }
                }}
                className={clsx(
                    "grid gap-8 grid-cols-6 big-computer:grid-cols-8 w-full min-h-full small-computer:grid-cols-4",
                )}
                animation={150}
                group={{
                    name: "brands",
                    pull: false
                }}
            >
                {category.brands.length > 0 ? [...category.brands].map(
                    (v, index) => (
                        <div className="relative" key={v.id}>
                            <BrandsGridItem {...v} className="handle" index={index + 1} />
                            <DeleteTrigger className={"w-[24px] absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"} message={"Supprimer la marque de la sélection ?"} onClick={()=>{
                                const updatedCategory = {
                                    ...category,
                                    brands: [...category.brands].filter(({id})=>{
                                        return id !== v.id
                                    })
                                }
                                setCategories([...categories].map((v) => {
                                    if (v.id === updatedCategory.id) {
                                        return updatedCategory;
                                    } else {
                                        return v;
                                    }
                                }));
                                setCategory(updatedCategory);
                                setEdits(true);
                            }}/>
                        </div>
                    )
                ) : <div className="absolute w-full h-full top-0 left-0"></div>}
            </ReactSortable>
        </div>
    );
}

// Helper function to compare arrays
function arraysAreEqual(array1, array2) {
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i].id !== array2[i].id) return false;
    }
    return true;
}
