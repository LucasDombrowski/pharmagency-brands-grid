import clsx from "clsx";

export default function CategoriesList({ className, useCategories, categories, setCategory, category }) {
    return (
        <div className={clsx(
            "font-medium text-24 flex items-center",
            className
        )}>
            <h2>{useCategories ? "Vos catégories :" : "Sans catégories"}</h2>
            {useCategories &&
                <div className="flex items-center">
                    {categories.map(
                        v => <button className={clsx(
                            v.id === category.id ? "" : ""
                        )}>
                            {v.name}
                        </button>
                    )}
                </div>}
        </div>
    )
}