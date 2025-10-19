import { game$, selectedPieceRotationEvent } from '@/lib/store/game$';
import { RotateCcwIcon, RotateCwIcon } from 'lucide-react';
import { RotateButton } from './rotate-button';
import { observer, use$ } from '@legendapp/state/react';

export const RotationController = observer(() => {
    const selectedPieceLocation = use$(game$.turn.selectedPieceLocation);

    const disabled = !selectedPieceLocation;

    return (
        <div className="flex border-0 bg-black/25 border-black/75 p-1 gap-4 rounded-full">
            <RotateButton
                disabled={disabled}
                onClick={selectedPieceRotationEvent.left.fire}
                icon={<RotateCcwIcon strokeWidth={2} />}
            />

            <RotateButton
                disabled={disabled}
                onClick={selectedPieceRotationEvent.right.fire}
                icon={<RotateCwIcon strokeWidth={2} />}
            />
        </div>
    )
});