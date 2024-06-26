import clsx from "clsx";
import DeleteTrigger from "../../../DeleteTrigger";
import { useMediaQuery } from "react-responsive";
import Dropdown from "../../../forms/inputs/Dropdown";
import { ReactSortable } from "react-sortablejs";

export default function CategoriesList({ className, useCategories, categories, setCategory, category, deleteCategory, setCategories }) {
    const isTablet = useMediaQuery({
        query: "(max-width: 800px)"
    });

    const handleSortChange = (newList) => {
        // Remove the header from the new list before updating categories
        const sortedCategories = newList.filter(item => item.id !== 'header');
        if (!arraysAreEqual(sortedCategories, categories)) {
            setCategories(sortedCategories);
        }
    };

    const sortableItems = [
        ...(useCategories && category ? categories.map((v) => ({
            ...v,
            content: (
                <div className="mr-6 relative mb-4" key={v.id}>
                    <button className={clsx(
                        "transition-all whitespace-nowrap cursor-move",
                        v.id === category.id ? "text-pharmagency-cyan" : "text-pharmagency-grey hover:text-pharmagency-blue"
                    )} onClick={() => setCategory(v)}>
                        {v.name}
                    </button>
                    <DeleteTrigger className={"w-[16px] absolute right-0 top-0 translate-x-1/2 -translate-y-full"} message={`Voulez-vous supprimer la catégorie "${v.name}" et toutes les marques de sa collection ?`} onClick={() => deleteCategory(v)} />
                </div>
            )
        })) : [])
    ];

    return (
        <div className={className}>
            {isTablet ? (
                <div className="w-full flex flex-col items-center">
                    <h2 className="text-18 font-medium">{useCategories ? "Vos catégories :" : "Sans catégories"}</h2>
                    {(useCategories && category) && (
                        <div className="flex items-center justify-center w-full">
                            <Dropdown className={"w-full max-w-[300px]"} options={categories.map((v) => ({
                                label: v.name,
                                value: v
                            }))} onChange={(v) => setCategory(v)} placeholder={category.name} />
                            <DeleteTrigger className={"w-[24px] ml-4 relative"} message={`Voulez-vous supprimer la catégorie "${category.name}" et toutes les marques de sa collection ?`} onClick={() => deleteCategory(category)} />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="flex items-start">
                        <div className="flex items-center text-18">
                            <h2 className="mr-6 whitespace-nowrap">{useCategories ? "Vos catégories :" : "Sans catégories"}</h2>
                        </div>
                        <ReactSortable list={sortableItems} setList={handleSortChange} className="inline-flex items-center flex-wrap text-18" animation={150}>
                            {sortableItems.map((item, index) => (
                                <div key={index} className="sortable-item" data-id={item.id}>
                                    {item.content}
                                </div>
                            ))}
                        </ReactSortable>
                    </div>
                    {(useCategories && category) && (
                        <div className="text-14 font-medium text-pharmagency-grey italic small-computer:text-16">
                            Cliquez sur l'une de vos catégories pour modifier le contenu
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function arraysAreEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i].id !== array2[i].id) {
            return false;
        }
    }
    return true;
}

