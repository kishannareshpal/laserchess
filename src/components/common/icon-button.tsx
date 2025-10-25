import type { JSX } from "react"
import clsx from "clsx"

type IconButtonProps = React.ComponentProps<'button'> & {
    icon: JSX.Element,
}

export const IconButton = ({ icon, className, ...props }: IconButtonProps) => {
    return (
        <button
            className={clsx("hover:bg-foreground/10 hover:text-foreground disabled:text-foreground/25 disabled:pointer-events-none hover:cursor-pointer duration-150 active:scale-95 p-2 rounded-full", className)}
            {...props}
        >
            {icon}
        </button>
    )
}