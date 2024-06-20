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

export default function Manager({ userToken }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [brands, setBrands] = useState([]);
    const [useCategories, setUseCategories] = useState(false);
    const [options, setOptions] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [edits, setEdits] = useState(null);

    async function getClient() {
        try {
            const response = await axios.get(`${BASE_URL}/clients/token/${token}`);
            console.log(response.data);
            setClient(response.data);
        } catch (err) {
            console.log(err);
            navigate(INDEX_URL);
        }
    }

    async function getBrands() {
        try {
            const response = await axios.get(`${BASE_URL}/brands?query=${search}&limit=10&code=${client.departmentCode}`);
            setBrands(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    function getOptions() {
        const labels = ["Aromathérapie", "Homéopathie", "Matériel médical", "Orthopédie", "Parapharmacie"];
        var count = 0;
        return labels.map((v) => {
            const data = {
                brands: [],
                name: v,
                new: true
            };
            const test = testCategoryName(v);
            data.id = !test ? getNewCategoryId() + count : test.id;
            count++;
            return {
                label: v,
                value: data
            }
        }).filter((v) => {
            return !testCategoryName(v.value.name);
        })
    }

    function testCategoryName(name) {
        const filter = [...categories].find((v) => {
            return v.name === name
        });
        return (filter && filter != undefined) ? filter : null;
    }

    function getNewCategoryId() {
        if (categories.length === 0) {
            return 1;
        }
        return Math.max(...categories.map(({ id }) => id)) + 1;
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
    }

    function resetCategories() {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Attention ! Cette action placera vos marques dans une seule collection et supprimera vos catégories.");
        if (isConfirmed) {
            const updatedCategories = generatePlaceholderCategory();
            updatedCategories[0].brands = getAllCategoriesBrands();
            setCategory(updatedCategories[0]);
            setCategories(updatedCategories);
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
    }

    function generatePlaceholderCategory(brands = []) {
        return [
            {
                id: getNewCategoryId(),
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
        getClient();

    }


    useEffect(() => {
        getClient();
    }, [token]);

    useEffect(() => {
        if (client) {
            setEdits(null);
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
    }, [search, client, category]);

    useEffect(() => {
        const test = testCategoryName(placeholderCategoryName);
        if (categories.length > 0 && (categories.length > 1 || !test)) {
            setUseCategories(true);
            if (test) {
                deleteCategory(test);
            }
        } else {
            setUseCategories(false);
        }
        setOptions(getOptions());
    }, [categories]);

    const sideContainerClass = "min-w-[360px] max-w-[360px] h-full px-8 py-6";
    const placeholderCategoryName = "Sans catégories"


    if (client) {
        return (
            <div className="w-dvw h-dvh">
                <div className="w-full h-full flex">
                    <div className={clsx(
                        sideContainerClass,
                        "bg-gradient-to-b from-pharmagency-cyan to-pharmagency-blue rounded-r-3xl text-pharmagency-white -ml-[290px] hover:-ml-0 transition-all duration-500"
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
                                    <span className="font-light underline">{client.domain}</span>
                                </div>
                            </div>
                            <div>
                                <a target="_blank" href="https://www.catalogues-pharmagency.fr/signaler-probleme">
                                    <div className="flex flex-col items-center">
                                        <WhiteLogo className={"max-w-[150px] mb-4"} />
                                        <span className="underline font-medium text-20">Signaler un problème</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="grow h-full px-8 py-8">
                        <div className="w-full h-full flex flex-col justify-between">
                            <div className="grow flex flex-col w-full overflow-hidden">
                                <div>
                                    <div className="flex items-center">
                                        <h2 className="text-24 font-medium">Ajouter une nouvelle catégorie :</h2>
                                        <Dropdown options={options}
                                            placeholder={"Sélectionner..."}
                                            className={"min-w-[300px] ml-8"}
                                            onChange={(v) => {
                                                addCategory(v);
                                            }} />
                                    </div>
                                    {!testCategoryName(placeholderCategoryName) && <button className="font-light text-pharmagency-blue underline mt-4" onClick={() => {
                                        resetCategories();
                                    }}>Je ne souhaite pas utiliser de catégories</button>}
                                </div>
                                <CategoriesList className={"mt-8 border-b border-pharmagency-blue pb-8"} useCategories={useCategories} categories={categories} category={category} setCategory={setCategory} deleteCategory={deleteCategory} />
                                <div className="pt-8 grow w-full overflow-y-scroll pr-8 relative">
                                    {category && <CategoryBrands setCategory={setCategory} setCategories={setCategories} category={category} categories={categories} className={"w-full min-h-full"} />}
                                    {(!category || category.brands.length === 0) && <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-24 font-medium">Veuillez ajouter vos marques...</h2>}
                                </div>
                            </div>
                            <div className="w-full flex flex-col pt-8 border-t border-pharmagency-blue">
                                <div className="flex w-full justify-end">
                                    {edits && <>
                                        <Button className={"bg-pharmagency-red text-pharmagency-white border border-pharmagency-red hover:bg-pharmagency-white hover:text-pharmagency-red transition-all"} onClick={() => {
                                            resetManager();
                                        }}>Annuler</Button>
                                    </>}
                                    <Button className={"text-pharmagency-white bg-pharmagency-cyan transition-all hover:bg-pharmagency-blue ml-4"} onClick={() => {
                                        save();
                                    }}>{loading ? <Circles
                                        width={20}
                                        height={20}
                                        color={colors.white} />
                                        : "Sauvegarder"}</Button>
                                </div>
                                <div className="w-full flex justify-center">
                                    <a className="text-20 font-medium underline" href="https://www.pharmagency.fr/" target="_blank ">pharmagency.fr</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(
                        sideContainerClass,
                        "shadow-2xl rounded-l-3xl"
                    )}>
                        <div className="h-full flex flex-col">
                            <div className="grow flex flex-col overflow-hidden">
                                <h2 className="text-24 font-medium">Ajoutez vos marques</h2>
                                <TextInput type={"search"} value={search} setValue={setSearch} placeholder={"Recherche..."} className={"bg-pharmagency-lighter-grey text-16 my-8"} />
                                <Brands brands={brands} className={"grow"} addBrand={addBrand} />
                            </div>
                            <div className="w-full flex justify-center mt-8">
                                <a className="text-20 font-medium underline text-pharmagency-cyan transition-all hover:text-pharmagency-blue" href="https://www.catalogues-pharmagency.fr/marque-manquante" target="_blank">Une marque manquante ?</a>
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