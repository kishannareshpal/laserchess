import type React from "react"
import { clsx } from "clsx"

type RowProps = React.ComponentProps<'div'> & {
    label: string,
    description?: string
}

export const Row = ({ className, label, description, children, ...props }: RowProps) => {
    return (
        <div className={clsx("flex flex-col flex-1 gap-2 justify-between", className)} {...props}>
            <div className="flex flex-1 flex-row gap-2 items-center justify-between">
                <div className="flex flex-1">
                    <p>{label}</p>
                </div>

                <div className="flex">
                    {children}
                </div>
            </div>

            <div className="flex">
                {description ? (
                    <p className="text-xs text-black/50">{description}</p>
                ) : null}
            </div>
        </div>
    )
}