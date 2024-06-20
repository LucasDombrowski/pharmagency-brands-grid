import clsx from "clsx";

export default function DeleteTrigger({className, onClick, message}){
    const crossPartClassName = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-pharmagency-white"
    return (
        <button className={clsx(
            "rounded-full bg-pharmagency-red aspect-square",
            className
        )}
        onClick={()=>{
             // eslint-disable-next-line no-restricted-globals
            const isConfirmed = confirm(message);
            if(isConfirmed){
                onClick();
            }
        }}>
            <div className="absolute w-[50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={clsx(
                    crossPartClassName,
                    "rotate-45"
                )}></div>
                <div className={clsx(
                    crossPartClassName,
                    "-rotate-45"
                )}></div>
            </div>
        </button>
    )
}