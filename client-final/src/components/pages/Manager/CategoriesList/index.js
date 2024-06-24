import clsx from "clsx";
import DeleteTrigger from "../../../DeleteTrigger";
import { useMediaQuery } from "react-responsive";
import Dropdown from "../../../forms/inputs/Dropdown";

export default function CategoriesList({ className, useCategories, categories, setCategory, category, deleteCategory }) {
    const isTablet = useMediaQuery({
        query: "(max-width: 800px)"
    });

    if (isTablet) {
        return (
            <div className={className}>
                <div className="w-full flex flex-col items-center">
                    <h2 className="text-24 mobile:text-20 font-medium mb-4">{useCategories ? "Vos catégories :" : "Sans catégories"}</h2>
                    {(useCategories && category) && <div className="flex items-center justify-center w-full">
                        <Dropdown className={"w-full max-w-[300px]"} options={[...categories.map((v) => {
                            return {
                                "label": v.name,
                                "value": v
                            }
                        })]} onChange={(v) => {
                            setCategory(v);
                        }} placeholder={category.name} />
                        <DeleteTrigger className={"w-[24px] ml-4 relative"} message={`Voulez-vous supprimer la catégorie "${category.name}" et toutes les marques de sa collection ?`} onClick={() => {
                            deleteCategory(category);
                        }} />
                    </div>}
                </div>
            </div>
        )
    } else {
        return (
            <div className={className}>
                <div className={clsx(
                    "font-medium text-24 small-computer:text-20 flex items-center",
                )}>

                    <div className="flex items-center flex-wrap">
                        <h2 className="mr-2 whitespace-nowrap">{useCategories ? "Vos catégories :" : "Sans catégories"}</h2>
                        {(useCategories && category) && categories.map(
                            (v, index) => <div className="mx-3 relative" key={index}>
                                <button className={clsx(
                                    "transition-all whitespace-nowrap my-2",
                                    v.id === category.id ? "text-pharmagency-cyan" : "text-pharmagency-grey hover:text-pharmagency-blue"
                                )} onClick={() => {
                                    setCategory(v);
                                }}>
                                    {v.name}
                                </button>
                                <DeleteTrigger className={"w-[20px] absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"} message={`Voulez-vous supprimer la catégorie "${v.name}" et toutes les marques de sa collection ?`} onClick={() => {
                                    deleteCategory(v);
                                }} />
                            </div>
                        )}
                    </div>
                </div>
                {(useCategories && category) &&
                    <div className="text-20 font-medium text-pharmagency-grey underline small-computer:text-16">
                        Cliquez sur l'une de vos catégories pour modifier le contenu
                    </div>}
            </div>
        )
    }
}