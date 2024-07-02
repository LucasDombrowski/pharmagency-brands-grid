import clsx from "clsx"

export default function TextInput({className, type, placeholder, value, setValue, svgIcon, min, required = false, backgroundClass = "bg-pharmagency-white"}){
    return (
        <div className={clsx(
            " py-3 px-5 rounded-3xl",
            className,
            backgroundClass
        )}>
            <div className="flex items-center w-full">
                <div className="mr-3">
                    {svgIcon}
                </div>
                <input type={type} placeholder={placeholder} value={value} onChange={(e)=>{
                    setValue(e.target.value)
                }} className="bg-transparent grow outline-none placeholder:text-pharmagency-grey text-pharmagency-blue min-w-[0px] w-full" required={required} min={min}/>
            </div>
        </div>
    )
}