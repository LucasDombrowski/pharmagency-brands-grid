export default function BrandsGridInput(props){
    function handleSubmit(e){
        e.preventDefault();
        props.onSubmit();
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
            type="search"
            name="search"
            className="w-full border-b-2 border-b-black text-xl"
            placeholder="Rechercher"
            onChange={props.onChange}/>
        </form>
    )
}