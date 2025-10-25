import * as DialogPrimitive from "@radix-ui/react-dialog"

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;

export const Trigger = (props: DialogProps) => {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}
