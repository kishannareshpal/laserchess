import * as React from "react";

import clsx from "clsx";

type HeaderProps = React.ComponentProps<"div">;

export const Header = ({ className, ...props }: HeaderProps) => {
    return (
        <div
            data-slot="dialog-header"
            className={clsx("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props} />
    );
}
