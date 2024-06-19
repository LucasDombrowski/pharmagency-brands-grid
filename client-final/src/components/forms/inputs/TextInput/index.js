import clsx from "clsx"

export default function TextInput({className, type, placeholder, value, setValue, svgIcon, required = false}){
    return (
        <div className={clsx(
            "bg-pharmagency-white py-3 px-5 rounded-3xl",
            className
        )}>
            <div className="flex items-center w-full">
                <div className="mr-3">
                    {svgIcon}
                </div>
                <input type={type} placeholder={placeholder} value={value} onChange={(e)=>{
                    setValue(e.target.value)
                }} className="bg-transparent grow outline-none placeholder:text-pharmagency-grey text-pharmagency-blue" required={required}/>
            </div>
        </div>
    )
}