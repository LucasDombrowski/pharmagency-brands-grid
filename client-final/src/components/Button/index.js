import clsx from "clsx";

export default function Button({className, type = "button", onClick = ()=>{}, children}){
    return (
        <button
        type={type}
        onClick={onClick}
        className={clsx(
            "px-5 py-3 rounded-3xl min-w-[100px] flex justify-center items-center",
            className
        )}>{children}</button>
    )
}