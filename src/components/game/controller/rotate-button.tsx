import type { HTMLProps, JSX } from "react"

export type RotateButtonProps = {
    onClick: () => void,
    icon: JSX.Element,
    disabled: HTMLProps<HTMLDivElement>['disabled']
}

export const RotateButton = ({ icon, disabled, onClick }: RotateButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="hover:bg-white disabled:text-white/25 disabled:pointer-events-none hover:cursor-pointer duration-150 active:scale-95 hover:text-black p-2 rounded-full"
        >
            {icon}
        </button>
    )
}