import { game$ } from '@/lib/store/game$';
import { RotateCcwIcon, RotateCwIcon } from 'lucide-react';
import { RotateButton } from './rotate-button';
import { rotationEvent } from '@/lib/store/events/rotation-event';
import { useTheme } from '@/lib/hooks/use-theme';
import { useValue } from '@legendapp/state/react';

export const RotationController = () => {
    const selectedPieceLocation = useValue(game$.turn.selectedPieceLocation);
    const theme = useTheme();

    const disabled = !selectedPieceLocation;

    return (
        <div
            className="flex border-0 p-1 gap-4 duration-300 rounded-full aria-disabled:opacity-25"
            style={{ background: theme.colors.controls.surface, color: theme.colors.controls.text }}
            aria-disabled={disabled}
        >
            <RotateButton
                disabled={disabled}
                onClick={rotationEvent.left.fire}
                icon={<RotateCcwIcon strokeWidth={2} />}
            />

            <RotateButton
                disabled={disabled}
                onClick={rotationEvent.right.fire}
                icon={<RotateCwIcon strokeWidth={2} />}
            />
        </div>
    )
};