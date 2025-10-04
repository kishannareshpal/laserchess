import { Stage } from "react-konva";
import { BoardLayer } from "./layer";
import { useEffect } from "react";
import { game$ } from "@/utils/store/game";
import type { Size } from "@/models/models/size";
import { SizeHelper } from "@/models/helpers/size-helper";

const BOARD_LENGTH: number = 500;
const BOARD_SIZE: Size = SizeHelper.square(BOARD_LENGTH);
const CELL_LENGTH = BOARD_LENGTH / 10;

export const Board = () => {
    useEffect(() => {
        game$.setupBoard();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <Stage width={BOARD_SIZE.width} height={BOARD_SIZE.height} className="border-2">
                <BoardLayer
                    cellLength={CELL_LENGTH}
                    // reference={stagePiecesRef}
                    // cellSize={getCellSize()}
                    // onBoardPieceMove={(movement, srcPieceXY) => {
                    //     // console.log("Movement made!", movement);
                    //     // console.log("From board: ", board);

                    //     // For Special move only, we need to animate the switch manually.
                    //     // You can comment out this part of the code if you prefer reduced motion (no move animation)
                    //     if (movement.type === MovementTypesEnum.SPECIAL) {
                    //         // Grab the piece that is being switched with the Switch piece.
                    //         const [destBoardPiece] = stagePiecesRef.current.find(`#${movement.destLocation.an}`);

                    //         // And move it to where the Switch piece srcLocation (Because you are already dragging the Switch to the destLocation)
                    //         destBoardPiece.to({
                    //             x: srcPieceXY.x,
                    //             y: srcPieceXY.y,
                    //             duration: pieceAnimDuration,
                    //             easing: pieceAnimEasing
                    //         });
                    //     }

                    //     // Perform the movement
                    //     // - Only delay if the movement type is NORMAL or SPECIAL (bc there is some animation on these movement types). 
                    //     //   No need to delay while rotating, cause its istant!
                    //     // ? Add an option to disable animations.
                    //     let delayed = !(movement.type === MovementTypesEnum.ROTATION_CLOCKWISE || movement.type === MovementTypesEnum.ROTATION_C_CLOCKWISE);
                    //     if (delayed) {
                    //         // Delay the state change so that the konva animation finishes.
                    //         setTimeout(() => {
                    //             dispatch(applyMovement({ movement: movement.serialize() }));
                    //         }, 332); // 332ms is the tween duration for every piece movement in the game.

                    //     } else {
                    //         dispatch(applyMovement({ movement: movement.serialize() }));
                    //     }
                    // }} 
                />
            </Stage>
        </div>
    );
}






// {/* <div className="board" ref={stageContainerRef}>
//     {/* Passing our store from current DOM context, to the Canvas context. This allows us to access our store from the Konva elements aswell. */}
//     <ReactReduxContext.Consumer>
//         {({ store }) => (
//             <Stage id="stage" className="stage"
//                 onClick={(e) => {
//                     // if (!e.target.id()) {
//                     // 	dispatch(unselectPiece()); // unselect
//                     // }
//                 }}
//                 onTap={(e) => {
//                     // if (!e.target.id()) {
//                     // 	dispatch(unselectPiece()); // unselect
//                     // }
//                 }}
//                 width={getBoardSize()}
//                 height={getBoardSize() - (2 * (getCellSize()))}>

//                 <Provider store={store}>
                    // <BoardLayer
                    //     reference={stagePiecesRef}
                    //     cellSize={getCellSize()}
                    //     onBoardPieceMove={(movement, srcPieceXY) => {
                    //         // console.log("Movement made!", movement);
                    //         // console.log("From board: ", board);

                    //         // For Special move only, we need to animate the switch manually.
                    //         // You can comment out this part of the code if you prefer reduced motion (no move animation)
                    //         if (movement.type === MovementTypesEnum.SPECIAL) {
                    //             // Grab the piece that is being switched with the Switch piece.
                    //             const [destBoardPiece] = stagePiecesRef.current.find(`#${movement.destLocation.an}`);

                    //             // And move it to where the Switch piece srcLocation (Because you are already dragging the Switch to the destLocation)
                    //             destBoardPiece.to({
                    //                 x: srcPieceXY.x,
                    //                 y: srcPieceXY.y,
                    //                 duration: pieceAnimDuration,
                    //                 easing: pieceAnimEasing
                    //             });
                    //         }

                    //         // Perform the movement
                    //         // - Only delay if the movement type is NORMAL or SPECIAL (bc there is some animation on these movement types). 
                    //         //   No need to delay while rotating, cause its istant!
                    //         // ? Add an option to disable animations.
                    //         let delayed = !(movement.type === MovementTypesEnum.ROTATION_CLOCKWISE || movement.type === MovementTypesEnum.ROTATION_C_CLOCKWISE);
                    //         if (delayed) {
                    //             // Delay the state change so that the konva animation finishes.
                    //             setTimeout(() => {
                    //                 dispatch(applyMovement({ movement: movement.serialize() }));
                    //             }, 332); // 332ms is the tween duration for every piece movement in the game.

                    //         } else {
                    //             dispatch(applyMovement({ movement: movement.serialize() }));
                    //         }
                    //     }} />
//                 </Provider>
//             </Stage>
//         )}
//     </ReactReduxContext.Consumer>
//     </div> */}