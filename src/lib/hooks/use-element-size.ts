import { SizeHelper } from "@/models/helpers/size-helper";
import type { Size } from "@/models/size";
import { useEffect, useRef, useState } from "react";

export type UseElementSizeValue<THTMLElement extends HTMLElement> = [Size, React.RefObject<THTMLElement>]

export const useElementSize = <THTMLElement extends HTMLElement>(): UseElementSizeValue<THTMLElement> => {
    const [size, setSize] = useState<Size>(SizeHelper.zero());
    const elementRef = useRef<THTMLElement>(null!);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry || !entry.contentRect) {
                return;
            }

            setSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        });

        // register the observer for the div
        const current = elementRef.current;
        resizeObserver.observe(current);

        // unregister the observer
        return () => {
            if (current) resizeObserver.unobserve(current);
            resizeObserver.disconnect();
        }
    }, []);

    return [size, elementRef]
}