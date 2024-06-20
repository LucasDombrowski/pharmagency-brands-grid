import { useEffect, useRef } from "react";
import BrandsGridItem from "../Brands/BrandsGridItem";
import Sortable from "sortablejs";
import { ReactSortable } from "react-sortablejs";
import clsx from "clsx";
import DeleteTrigger from "../../../DeleteTrigger";

export default function CategoryBrands({ setCategory, category, categories, setCategories, deleteBrand, className }) {
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
                    "grid gap-8 grid-cols-8 w-full min-h-full small-computer:grid-cols-6",
                )}
                animation={150}
                group={{
                    name: "brands",
                    pull: false
                }}>
                {category.brands.length > 0 ? [...category.brands].map(
                    (v, index) => <div className="relative">
                        <BrandsGridItem {...v}
                            className="handle" index={index + 1} />
                        <DeleteTrigger className={"w-[24px] absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"} message={"Supprimer la marque de la sélection ?"} onClick={()=>{
                            const updatedCategory = {
                                ...category,
                                brands: [...category.brands].filter(({id})=>{
                                    return id!==v.id
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
                        }}/>
                    </div>
                ) : <div className="absolute w-full h-full top-0 left-0">
                </div>}
            </ReactSortable>
        </div>
    )
}