import clsx from "clsx";
import DeleteTrigger from "../../../DeleteTrigger";

export default function CategoriesList({ className, useCategories, categories, setCategory, category, deleteCategory }) {
    return (
        <div className={className}>
            <div className={clsx(
                "font-medium text-24 flex items-center",
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
                                <DeleteTrigger className={"w-[20px] absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"} message={`Voulez-vous supprimer la catégorie "${v.name}" ?`} onClick={() => {
                                    deleteCategory(v);
                                }} />
                            </div>
                        )}
                    </div>
            </div>
            {(useCategories && category) &&
            <div className="text-20 font-medium text-pharmagency-grey underline mt-4">
                Cliquez sur l'une de vos catégories pour modifier le contenu
            </div>}
        </div>
    )
}