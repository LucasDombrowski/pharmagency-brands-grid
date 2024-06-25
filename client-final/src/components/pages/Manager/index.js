import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, INDEX_URL } from "../../../settings";
import clsx from "clsx";
import WhiteLogo from "../../images/logos/WhiteLogo";
import Dropdown from "../../forms/inputs/Dropdown";
import TextInput from "../../forms/inputs/TextInput";
import Brands from "./Brands";
import CategoriesList from "./CategoriesList";
import CategoryBrands from "./CategoryBrands";
import Button from "../../Button";
import { colors } from "../../../settings";
import { Circles } from "react-loader-spinner";
import { useMediaQuery } from "react-responsive";

export default function Manager({ userToken }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [brands, setBrands] = useState([]);
    const [useCategories, setUseCategories] = useState(false);
    const [options, setOptions] = useState([]);
    const [allOptions, setAllOptions] = useState([]);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [edits, setEdits] = useState(false);
    const [saved, setSaved] = useState(false);

    const isTablet = useMediaQuery({
        query: "(max-width:800px)"
    });

    async function getClient() {
        try {
            const response = await axios.get(`${BASE_URL}/clients/token/${token}`);
            setClient(response.data);
        } catch (err) {
            console.log(err);
            navigate(INDEX_URL);
        }
    }

    async function getBrands() {
        try {
            const response = await axios.get(`${BASE_URL}/brands?query=${search}&limit=${isTablet ? "4" : "10"}&code=${client.departmentCode}`);
            setBrands(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function getOptions() {
        setOptionsLoading(true);
        const labels = [
            "Anti-moustique / Anti-poux",
            "Aromathérapie",
            "Autres",
            "CBD",
            "Compléments alimentaires",
            "Contactologie",
            "Contention",
            "Coutellerie",
            "Diabète",
            "Diététique",
            "Dénutrition",
            "Dermocosmétique",
            "Fleurs de Bach",
            "Herboristerie",
            "Homéopathie",
            "Hygiène bucco-dentaire",
            "Hygiène féminine",
            "Hygiène intime",
            "Incontinence",
            "Lunettes / loupes",
            "Maquillage",
            "Matériel médical",
            "Médecine naturelle",
            "Médication familiale",
            "Minéraux et vitamines",
            "Nutrition infantile",
            "Oncologie",
            "Orthopédie",
            "Parapharmacie",
            "Parfumerie",
            "Phytothérapie",
            "Premiers soins",
            "Produits bébés",
            "Produits bio",
            "Produits cosmétiques",
            "Produits dentaires",
            "Produits naturels",
            "Produits solaires",
            "Produits vétérinaires",
            "Prothèses capillaires",
            "Prothèses mammaires",
            "Soins capillaires",
            "Soins des pieds",
            "Soins de la peau",
            "Soins du visage",
            "Soins homme",
            "Tabagisme",
            "Thés / Tisanes",
            "Voyages",
            "Zéro déchet",
        ];

        // Step 1: Get the occurrence count for each label
        const labelCounts = await Promise.all(labels.map(async (label) => {
            const count = await countCategoryNameOccurences(label);
            return { label, count };
        }));

        // Step 2: Sort the labels based on the counts
        labelCounts.sort((a, b) => b.count - a.count);

        // Step 3: Proceed with your existing mapping logic
        let count = 1;
        let { total } = (await axios.get(`${BASE_URL}/categories?limit=1`)).data;
        const res = labelCounts.map(({ label }) => {
            const data = {
                brands: [],
                name: label,
                new: true,
                order: count
            };
            const test = testCategoryName(label);
            data.id = !test ? total + count : test.id;
            count++;
            return {
                label,
                value: data
            };
        }).filter(({ value }) => {
            return !testCategoryName(value.name);
        })
        setAllOptions(res);
        setOptionsLoading(false);
    }

    function filterOptions() {
        setOptions([...allOptions].filter(({ value }) => {
            return !testCategoryName(value.name);
        }).sort((a, b) => {
            return a.order - b.order
        }));
    }

    async function countCategoryNameOccurences(name = "") {
        try {
            const response = await axios.get(`${BASE_URL}/categories?query=${name}`);
            return response.data.length;
        } catch (err) {
            console.log(err);
        }
    }

    function testCategoryName(name) {
        const filter = [...categories].find((v) => {
            return v.name === name
        });
        return (filter && filter != undefined) ? filter : null;
    }


    function deleteCategory(v) {
        var updatedCategories = [...categories].filter(({ id }) => {
            return id !== v.id
        });
        if (updatedCategories.length > 0) {
            setCategories(updatedCategories);
            setCategory(updatedCategories[0]);
        } else {
            updatedCategories = generatePlaceholderCategory();
            setCategory(updatedCategories[0]);
            setCategories(updatedCategories);
        }
        setEdits(true);
    }

    function resetCategories() {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Attention ! Cette action placera vos marques dans une seule collection et supprimera vos catégories.");
        if (isConfirmed) {
            const updatedCategories = generatePlaceholderCategory();
            updatedCategories[0].brands = getAllCategoriesBrands();
            setCategory(updatedCategories[0]);
            setCategories(updatedCategories);
            setEdits(true);
        }
    }

    function getAllCategoriesBrands() {
        const res = [];
        [...categories].map(({ brands }) => {
            return brands;
        }).forEach((v) => {
            v.forEach((brand) => {
                if (!res.some(item => item.id === brand.id)) {
                    res.push({ ...brand });
                }
            })
        });
        return res;
    }

    function addCategory(v) {
        const test = testCategoryName(placeholderCategoryName);
        if (test) {
            v.brands = [...test.brands];
        }
        setCategories([...categories, v]);
        setCategory(v);
        setEdits(true);
    }

    function generatePlaceholderCategory(brands = []) {
        return [
            {
                id: -1,
                name: placeholderCategoryName,
                brands,
                new: true
            }
        ];
    }

    function uniqueBrand(brand) {
        return category.brands.filter((v) => {
            return v.id === brand.id
        }).length === 0;
    }

    function addBrand(brand, index = null) {
        if (uniqueBrand(brand)) {
            const updatedBrands = [...category.brands];
            if (index) {
                updatedBrands.splice(index, 0, brand);
            } else {
                updatedBrands.push(brand);
            }
            const updatedCategory = {
                ...category,
                "brands": updatedBrands
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
        } else {
            setCategory(category);
        }
    };

    function resetManager() {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Annuler toutes les modifications ?");
        if (isConfirmed) {
            getClient();
        }
    }

    async function save() {
        setLoading(true);
        const validCategories = [...categories].filter(({ brands }) => {
            return brands.length > 0
        });

        for (let category of validCategories) {
            const url = `${BASE_URL}/categories${!category.new ? ("/" + category.id + "?_method=PUT") : ""}`;
            const data = {
                "client_id": client.id,
                "client_token": token,
                "name": category.name,
                "brands": [...category.brands].map((v) => {
                    return {
                        "name": v.name,
                        "url": (v.png_url ? v.png_url : v.jpg_url).replace(new RegExp(" ", "g"), "%20")
                    }
                })
            }
            try {
                await axios.post(url, data, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }

        const alreadyExistingCategories = [...validCategories].filter((v) => {
            return !v.new
        });

        const categoriesToDelete = [...client.categories].filter(({ id }) => {
            return !alreadyExistingCategories.some(item => item.id === id);
        })

        for (let category of categoriesToDelete) {
            const data = {
                "client_id": client.id,
                "client_token": token,
            };
            try {
                await axios.post(`${BASE_URL}/categories/${category.id}?_method=DELETE`, data, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
        setLoading(false);
        setSaved(true);
        getClient();

    }


    useEffect(() => {
        getClient();
    }, [token]);

    useEffect(() => {
        if (client) {
            setEdits(false);
            getOptions();
            if (client.categories.length > 0) {
                setCategories(client.categories);
                setCategory(client.categories[0]);
            } else {
                const placeholderCategory = generatePlaceholderCategory();
                setCategories(placeholderCategory);
                setCategory(placeholderCategory[0]);
            }
        }
    }, [client]);

    useEffect(() => {
        if (client) {
            getBrands();
        }
    }, [search, client, category, isTablet]);

    useEffect(() => {
        if (options.length > 0) {
            filterOptions();
        }
        const test = testCategoryName(placeholderCategoryName);
        if (categories.length > 0 && (categories.length > 1 || !test)) {
            setUseCategories(true);
            if (test) {
                deleteCategory(test);
            }
        } else {
            setUseCategories(false);
        }
    }, [categories]);

    useEffect(() => {
        if (edits) {
            setSaved(false);
        }
        const handleBeforeUnload = (event) => {
            if (edits) {
                event.preventDefault();
                event.returnValue = ''; // Display the confirmation dialog
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [edits]);

    useEffect(() => {
        setOptions([...allOptions]);
    }, [allOptions]);

    const sideContainerClass = "min-w-[360px] max-w-[360px] h-full px-8 py-8";
    const placeholderCategoryName = "Sans catégories"


    if (client) {
        return (
            <div className="w-dvw h-dvh">
                <div className="w-full h-full flex">
                    <div className={clsx(
                        sideContainerClass,
                        "bg-gradient-to-b from-pharmagency-cyan to-pharmagency-blue rounded-r-3xl text-pharmagency-white -ml-[290px] hover:-ml-0 transition-all duration-500",
                        "tablet:hidden"
                    )}>
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                {userToken && <div className="min-h-[2rem] mb-12">
                                    {userToken && <button className="text-24 font-medium" onClick={() => {
                                        navigate(-1);
                                    }}>&lt; Retour</button>}
                                </div>}
                                <h1 className="text-24 font-medium">Vous modifiez actuellement :</h1>
                                <div className="flex flex-col mt-8">
                                    <span className="text-20 font-medium">{client.name}</span>
                                    <a className="font-light underline" href={`https://${client.domain}`} target="_blank">{client.domain}</a>
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col items-center">
                                    <WhiteLogo className={"max-w-[150px] mb-4"} />
                                    <a className="underline font-medium text-14" target="_blank" href={`${INDEX_URL}/signaler-probleme`}>Signaler un problème</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grow h-full px-8 py-8 overflow-hidden">
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="grow flex flex-col w-full overflow-hidden">
                                <div className="small-computer:flex-col small-computer:items-center w-full small-computer:flex">
                                    <div className="flex items-center small-computer:flex-col">
                                        <h2 className="text-18 font-medium small-computer:mb-4 small-computer:text-center mobile:text-20 mr-8 small-computer:mr-0">Ajouter une nouvelle catégorie :</h2>
                                        {optionsLoading ? <Circles
                                            width={24}
                                            height={24}
                                            color={colors.cyan} /> : <Dropdown options={options}
                                                placeholder={"Sélectionner..."}
                                                className={"min-w-[300px]"}
                                                onChange={(v) => {
                                                    addCategory(v);
                                                }} />}
                                    </div>
                                    {!testCategoryName(placeholderCategoryName) && <button className="font-light text-pharmagency-blue underline mt-4 transition-all hover:text-pharmagency-red text-14" onClick={() => {
                                        resetCategories();
                                    }}>Je ne souhaite pas utiliser de catégories</button>}
                                </div>
                                <CategoriesList className={"mt-8 border-b border-pharmagency-blue pb-8 w-full"} useCategories={useCategories} categories={categories} category={category} setCategory={setCategory} deleteCategory={deleteCategory} />
                                <div className="pt-8 grow w-full overflow-y-scroll pr-8 relative">
                                    {category && <CategoryBrands setCategory={setCategory} setCategories={setCategories} category={category} categories={categories} className={"w-full min-h-full"} setEdits={setEdits} />}
                                    {(!category || category.brands.length === 0) && <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-24 font-medium text-center">Veuillez ajouter vos marques...</h2>}
                                </div>
                            </div>
                            {isTablet ?
                                <div className="w-full overflow-hidden pt-8 border-t border-pharmagency-blue min-h-[150px]">
                                    {edits && <p className="mb-4 text-pharmagency-blue text-[14px] text-center">Les modifications effectuées n'ont pas été sauvegardées.</p>}
                                    {(!edits && saved) && <div className="mb-4 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 33 33" className="[&_path]:stroke-pharmagency-cyan">
                                            <g id="Icon_akar-circle-check" data-name="Icon akar-circle-check" transform="translate(-1.5 -1.5)">
                                                <path id="Tracé_11519" data-name="Tracé 11519" d="M12,18.75l4.5,4.5,7.5-9" fill="none" stroke="#00b591" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                                                <path id="Tracé_11520" data-name="Tracé 11520" d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z" fill="none" stroke="#00b591" stroke-width="3" />
                                            </g>
                                        </svg>
                                        <p className="text-pharmagency-blue text-14 ml-2">Modifications sauvegardées.</p>
                                    </div>}
                                    <div className="w-full flex items-center mb-4">
                                        <TextInput type={"search"} value={search} setValue={setSearch} placeholder={"Recherche..."} className={"text-16 grow"} backgroundClass="bg-pharmagency-lighter-grey" />
                                        {edits && <>
                                            <Button className={"bg-pharmagency-red text-pharmagency-white border border-pharmagency-red hover:bg-pharmagency-white hover:text-pharmagency-red transition-all ml-4 mobile:min-w-[0px] mobile:text-[10px]"} onClick={() => {
                                                resetManager();
                                            }}>Annuler</Button>
                                        </>}
                                        <Button className={"text-pharmagency-white bg-pharmagency-cyan transition-all hover:bg-pharmagency-blue ml-4 mobile:min-w-[0px] mobile:text-[10px]"} onClick={() => {
                                            save();
                                        }}>{loading ? <Circles
                                            width={20}
                                            height={20}
                                            color={colors.white} />
                                            : "Sauvegarder"}</Button>
                                    </div>
                                    <div className="w-full">
                                        <Brands brands={brands} addBrand={addBrand} scroll className={"!flex justify-between [&>div]:w-[25%] [&>div]:max-w-[100px]"} scrollContainerClassName={""} />
                                    </div>
                                </div>
                                :
                                <div className="w-full flex flex-col pt-8 border-t border-pharmagency-blue">
                                    <div className="flex w-full justify-end items-center mb-2">
                                        {edits && <>
                                            <p className="mr-4 text-pharmagency-blue text-14">Les modifications effectuées n'ont pas été sauvegardées.</p>
                                            <Button className={"bg-pharmagency-red text-pharmagency-white border border-pharmagency-red hover:bg-pharmagency-white hover:text-pharmagency-red transition-all"} onClick={() => {
                                                resetManager();
                                            }}>Annuler</Button>
                                        </>}
                                        {(!edits && saved) && <div className="mr-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="24" viewBox="0 0 33 33" className="[&_path]:stroke-pharmagency-cyan">
                                                <g id="Icon_akar-circle-check" data-name="Icon akar-circle-check" transform="translate(-1.5 -1.5)">
                                                    <path id="Tracé_11519" data-name="Tracé 11519" d="M12,18.75l4.5,4.5,7.5-9" fill="none" stroke="#00b591" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                                                    <path id="Tracé_11520" data-name="Tracé 11520" d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z" fill="none" stroke="#00b591" stroke-width="3" />
                                                </g>
                                            </svg>
                                            <p className="text-pharmagency-blue text-14 ml-2">Modifications sauvegardées.</p>
                                        </div>}
                                        <Button className={"text-pharmagency-white bg-pharmagency-cyan transition-all hover:bg-pharmagency-blue ml-4"} onClick={() => {
                                            save();
                                        }}>{loading ? <Circles
                                            width={20}
                                            height={20}
                                            color={colors.white} />
                                            : "Sauvegarder"}</Button>
                                    </div>
                                </div>}
                        </div>
                    </div>
                    <div className={clsx(
                        sideContainerClass,
                        "shadow-2xl rounded-l-3xl tablet:hidden"
                    )}>
                        <div className="h-full flex flex-col">
                            <div className="grow flex flex-col overflow-hidden">
                                <h2 className="text-24 font-medium">Ajoutez vos marques</h2>
                                <TextInput type={"search"} value={search} setValue={setSearch} placeholder={"Recherche..."} className={"text-16 my-8"} backgroundClass="bg-pharmagency-lighter-grey" />
                                <Brands brands={brands} className={"grow"} addBrand={addBrand} />
                            </div>
                            <div className="w-full flex justify-center mt-8">
                                <a className="text-14 font-medium underline text-pharmagency-cyan transition-all hover:text-pharmagency-blue text-14" href={`${INDEX_URL}/suggestion`} target="_blank">Suggérer une marque ou catégorie</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
};