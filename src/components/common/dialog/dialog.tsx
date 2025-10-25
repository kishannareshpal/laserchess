import * as DialogPrimitive from "@radix-ui/react-dialog"

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;

export const Dialog = (props: DialogProps) => {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />
}