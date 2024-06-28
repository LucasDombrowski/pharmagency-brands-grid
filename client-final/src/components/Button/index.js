import clsx from "clsx";

export default function Button({className, type = null, onClick = null, children}){
    if(onClick!==null || type!==null){
        return (
        <button
        type={type ? type : "button"}
        onClick={onClick}
        className={clsx(
            "px-5 py-3 rounded-3xl min-w-[100px] flex justify-center items-center",
            className
        )}>{children}</button>
        )
    } else {
        return (
        <div 
        className={clsx(
            "px-5 py-3 rounded-3xl min-w-[100px] flex justify-center items-center",
            className
        )}>{children}</div>
        )
    }
}