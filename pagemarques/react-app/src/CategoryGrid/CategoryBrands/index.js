import { useEffect, useState, useRef, useCallback } from "react";
import CategoryBrandsItem from "./CategoryBrandsItem";
import CategoryBrandsPagination from "./CategoryBrandsPagination";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";

export default function CategoryBrands(props) {
    const isTablet = useMediaQuery({
        query: '(max-width: 800px)'
    });
    const isMobile = useMediaQuery({
        query: '(max-width: 500px)'
    });
    const [page, setPage] = useState(1);
    const [brands, setBrands] = useState([]);
    const [count, updateCount] = useState(10);
    const observer = useRef(null);
    const brandsContainer = useRef(null);
    const [columns, setColumns] = useState(getResponsiveColumns());

    function getResponsiveColumns(){
        if(isMobile){
            return props.columns.mobile
        } else if(isTablet){
            return props.columns.tablet
        } else {
            return props.columns.computer
        }
    }
    

    function getCurrentPage() {
        const allBrands = props.brands;
        const lastIndex = page * props.paginationLimit;
        const firstIndex = lastIndex - props.paginationLimit;
        return [...allBrands.slice(firstIndex, lastIndex)];
    }

    function loadBrands() {
        const allBrands = props.brands;
        return [...allBrands.slice(0, count)];
    }

    useEffect(() => {
        if (props.loading === "pagination") {
            setBrands(getCurrentPage());
        }
    }, [page, props.brands, props.paginationLimit, props.loading]);

    useEffect(() => {
        if (props.loading === "lazy_loading") {
            if (count < props.brands.length) {
                setBrands(loadBrands());
            } else if (brands.length < props.brands.length) {
                setBrands(props.brands);
            }
        }
    }, [count, props.brands, props.loading]);

    const lastBrandElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                updateCount(prevCount => prevCount + 10);
            }
        });

        if (node) observer.current.observe(node);
    }, []);

    useEffect(() => {
        if (brands.length > 0 && props.loading === "lazy_loading") {
            const lastElement = brandsContainer.current?.lastElementChild;
            if (lastElement) {
                lastBrandElementRef(lastElement);
            }
        }
    }, [brands, lastBrandElementRef, props.loading]);

    useEffect(() => {
        setBrands(props.loading === "pagination" ? getCurrentPage() : loadBrands());
        setPage(1);
        updateCount(10);
    }, [props.brands]);

    useEffect(() => {
        window.dispatchEvent(new Event("pagemarques_grid_loaded"));
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    useEffect(()=>{
        setColumns(getResponsiveColumns());
    },[isMobile, isTablet]);

    return (
        <>
            <div className={clsx(
                "w-full grid mx-auto",
                props.cssClasses.grid_container
            )} ref={brandsContainer} style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                maxWidth: `${columns * props.imageSize}px`,
                gap: props.gridGap
            }}
            id="pagemarques-grid">
                {brands.map((v) => (
                    <CategoryBrandsItem key={v.id} {...v} cssClasses={props.cssClasses} />
                ))}
            </div>
            {props.loading === "pagination" && (
                <CategoryBrandsPagination 
                    page={page} 
                    setPage={setPage} 
                    {...props} 
                    max={Math.floor(props.brands.length / props.paginationLimit) + 1} 
                />
            )}
        </>
    );
}
