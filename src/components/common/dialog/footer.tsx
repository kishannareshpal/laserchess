import * as React from "react";

import clsx from "clsx";

type FooterProps = React.ComponentProps<'div'>;

export const Footer = ({ className, ...props }: FooterProps) => {
    return (
        <div
            data-slot="dialog-footer"
            className={clsx(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className
            )}
            {...props} />
    );
}
