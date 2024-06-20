import { useEffect, useRef } from "react";
import BrandsGridItem from "../Brands/BrandsGridItem";
import Sortable from "sortablejs";
import { ReactSortable } from "react-sortablejs";
import clsx from "clsx";

export default function CategoryBrands({setCategory, category, categories, setCategories, deleteBrand, className}) {
    const ref = useRef();
    return (
        <div className={clsx(
            className,
            "relative"
        )}>
            <ReactSortable
                list={category.brands}
                setList={(newState) => {
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
                    }))
                }}
                className={clsx(
                    "grid gap-4 grid-cols-5 w-full min-h-full",
                )}
                animation={150}
                group={{
                    name: "brands",
                    pull: false
                }}>
                {category.brands.length > 0 ? [...category.brands].map(
                    (v,index) => <BrandsGridItem {...v}
                        className="handle" index={index + 1}/>
                ) : <div className="absolute w-full h-full top-0 left-0">
                    </div>}
            </ReactSortable>
        </div>
    )
}