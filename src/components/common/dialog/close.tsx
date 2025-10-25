import * as DialogPrimitive from "@radix-ui/react-dialog";

type CloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;

export const Close = (props: CloseProps) => {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}
