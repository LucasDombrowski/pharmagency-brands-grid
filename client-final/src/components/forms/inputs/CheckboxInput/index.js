import clsx from "clsx"

export default function CheckboxInput({className, checked, setValue, label}){
    return (
        <div onClick={()=>{
            setValue(!checked)
        }}
        className={clsx(
            "flex items-center cursor-pointer",
            className
        )}>
            <div className={clsx(
                "w-[20px] aspect-square rounded-full mr-3",
                checked ? "bg-pharmagency-blue" : "bg-pharmagency-white"
            )}></div>
            <span>{label}</span>
        </div>
    )
}