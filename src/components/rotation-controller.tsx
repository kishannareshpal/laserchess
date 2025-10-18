import { selectedPieceRotationEvent } from '@/utils/store/game$';
import { RotateCcwIcon, RotateCwIcon } from 'lucide-react';

export const RotationController = () => {
    return (
        <div className="flex border-0 bg-black/25 border-black/75 p-1 gap-3 rounded-full">
            <button onClick={selectedPieceRotationEvent.left.fire} className="hover:bg-white hover:cursor-pointer duration-150 active:scale-95 hover:text-black p-2 rounded-full">
                <RotateCcwIcon strokeWidth={2} />
            </button>

            <button onClick={selectedPieceRotationEvent.right.fire} className="hover:bg-white hover:cursor-pointer duration-150 active:scale-95 hover:text-black p-2 rounded-full">
                <RotateCwIcon strokeWidth={2} />
            </button>
        </div>
    )
}