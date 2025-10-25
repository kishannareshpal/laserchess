import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Overlay } from "./overlay";
import { Portal } from "./portal";
import { XIcon } from "lucide-react";
import clsx from "clsx";

type ContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
}

export const Content = ({
    className,
    children,
    showCloseButton = true,
    ...props
}: ContentProps) => {
    return (
        <Portal data-slot="dialog-portal">
            <Overlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={clsx(
                    "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                    className
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </Portal>
    )
}