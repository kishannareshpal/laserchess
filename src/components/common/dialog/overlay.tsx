import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import clsx from "clsx";

type OverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;

export const Overlay = ({ className, ...props }: OverlayProps) => {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={clsx(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
                className
            )}
            {...props} />
    );
}
