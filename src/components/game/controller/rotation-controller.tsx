import { game$ } from '@/lib/store/game$';
import { RotateCcwIcon, RotateCwIcon } from 'lucide-react';
import { RotateButton } from './rotate-button';
import { observer, use$ } from '@legendapp/state/react';
import { rotationEvent } from '@/lib/store/events/rotation-event';

export const RotationController = observer(() => {
    const selectedPieceLocation = use$(game$.turn.selectedPieceLocation);

    const disabled = !selectedPieceLocation;

    return (
        <div className="flex border-0 bg-black/25 border-black/75 p-1 gap-4 duration-300 rounded-full aria-disabled:opacity-25" aria-disabled={disabled}>
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
});