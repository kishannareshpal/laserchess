import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

type PortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;

export const Portal = (props: PortalProps) => {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
