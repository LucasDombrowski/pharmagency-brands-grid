import { useMediaQuery } from "react-responsive";
import CategoryListItem from "./CategoryListItem";

export default function CategoryList(props){
    const params = props.params;
    const categories = props.categories;
    const isMobile = useMediaQuery({
        query: "(max-width: 500px)"
    });
    function handleChange(e){
        props.setCategory([...categories].find((v)=>v.id==e.target.value));
    }

    return (
        <div className="w-full mb-8">
            {isMobile ? 
            <div className="w-full flex justify-center items-center">
                <select id="pagemarques-category-select" onChange={handleChange} className="min-w-[200px] text-center border" style={
                    {
                        "background":params.secondaryColor,
                        "color":params.primaryColor,
                        "borderColor":params.primaryColor
                    }
                }>
                    {categories.map(
                        v=><option value={v.id} selected={v.id === props.category.id} className="text-center">
                            {v.name}
                        </option>
                    )}
                </select>
            </div> : 
            <div className="w-full flex justify-center items-center flex-wrap">
                {categories.map(
                    v=><CategoryListItem {...v} active={v.id === props.category.id} onClick={()=>{
                        props.setCategory(v);
                    }} {...params}/>
                 )}
            </div>}
        </div>
    )
}