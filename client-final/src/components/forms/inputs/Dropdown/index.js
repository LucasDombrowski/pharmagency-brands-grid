import ReactSelect from "react-select";

export default function Dropdown({options,placeholder, value = null, onChange, className}){
    return (
        <ReactSelect
        options={options}
        placeholder={placeholder}
        value={value}
        className={className}
        onChange={(v)=>{
            onChange(v.value)
        }}
        />
    )
}