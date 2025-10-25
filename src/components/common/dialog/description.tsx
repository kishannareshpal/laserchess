import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import clsx from "clsx";

type DescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;

export const Description = ({ className, ...props }: DescriptionProps) => {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={clsx("text-muted-foreground text-sm", className)}
            {...props} />
    );
}
