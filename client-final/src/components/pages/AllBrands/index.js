import WhiteLogo from "../../images/logos/WhiteLogo";
import clsx from "clsx";
import TextInput from "../../forms/inputs/TextInput";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../settings";
import DeleteTrigger from "../../DeleteTrigger";

export default function AllBrands({ token }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [max, setMax] = useState(false);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const containerClass = "max-w-[1200px]";
    const observer = useRef(null);
    const gridContainer = useRef(null);

    const lastBrandElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading && !max) {
                setPage(prevPage => prevPage + 1);
            }
        }, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        });

        if (node) observer.current.observe(node);
    }, [loading, max]);

    useEffect(() => {
        if (brands.length > 0) {
            const lastElement = gridContainer.current?.lastElementChild;
            if (lastElement) {
                lastBrandElementRef(lastElement);
            }
        }
    }, [brands, lastBrandElementRef]);

    async function handleDelete(id) {
        try {
            await axios.delete(`${BASE_URL}/brands/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setPage(1);
            setMax(false);
            setBrands([]);
            getBrands(true);
        } catch (err) {
            console.log(err);
        }
    }

    async function getBrands(reset = false) {
        const limit = 50;
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/brands?limit=${limit}&query=${search}`);
            setBrands(response.data.data);

            if (!response.data.next_page_url) {
                setMax(true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setMax(false);
        setBrands([]);
        getBrands(true);
    }, [search]);

    return (
        <div className="w-full">
            <div className="w-full bg-gradient-to-r from-pharmagency-blue to-pharmagency-cyan p-6 sticky top-0 left-0 flex items-center z-50">
                <div className="mr-8">
                    <WhiteLogo className={"max-w-[100px] mobile:max-w-[60px]"} />
                </div>
                <div className={clsx(
                    "w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[800px] small-computer:static small-computer:translate-x-0 small-computer:translate-y-0 flex items-center"
                )}>
                    <TextInput
                        type={"search"}
                        value={search}
                        setValue={setSearch}
                        placeholder={"Recherchez une marque..."}
                        className={"grow"} />
                    <Link className="text-pharmagency-white underline ml-4 text-center" to={"/admin/"}>
                        Voir les domaines
                    </Link>
                </div>
            </div>
            <div className={clsx(
                "mt-8 mx-auto px-6",
                containerClass
            )}>
                <div className="grid grid-cols-5 gap-10 tablet:grid-cols-4 mobile:!grid-cols-2" ref={gridContainer}>
                    <div className="border-2 border-pharmagency-blue transition-all scale-100 hover:scale-105 aspect-square">
                        <Link className="w-full h-full flex items-center justify-center text-center p-3 font-medium" to={"/admin/marques/ajouter"}>
                            Ajouter une marque
                        </Link>
                    </div>
                    {brands.map((v, index) => (
                        <div key={v.id} className="opacity-50 transition-all hover:opacity-100 scale-100 hover:scale-105 tablet:opacity-100 relative border-2 border-pharmagency-blue">
                            {index === brands.length - 1 ? (
                                <div ref={lastBrandElementRef} className="w-full">
                                    <Link to={`/admin/marques/${v.id}`} className="block w-full">
                                        <img alt={v.name} src={v.png_url ? v.png_url : v.jpg_url} className="w-full aspect-square object-contain" />
                                    </Link>
                                </div>
                            ) : (
                                <Link to={`/admin/marques/${v.id}`} className="block w-full">
                                    <img alt={v.name} src={v.png_url ? v.png_url : v.jpg_url} className="w-full aspect-square object-contain" />
                                </Link>
                            )}
                            <DeleteTrigger className={"absolute w-[24px] top-0 right-0 translate-x-1/2 -translate-y-1/2"} message={`Voulez-vous vraiment supprimer définitivement la marque "${v.name}" ?`} onClick={()=>{
                                handleDelete(v.id);
                            }}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
