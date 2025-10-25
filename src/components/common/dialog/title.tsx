import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import clsx from "clsx";

export type TitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;

export const Title = ({ className, ...props }: TitleProps) => {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={clsx("text-lg leading-none font-semibold", className)}
            {...props} />
    );
}
