import type { CellGrid } from "@/models/cell";
import type { GridLayerRef } from "@/types";
import { Cell } from ".";

type CollectionProps = {
  cellGrid: CellGrid;
  cellLength: number;
  gridLayerRef: GridLayerRef;
};

export const Collection = ({ cellGrid, cellLength, gridLayerRef }: CollectionProps) => {
  return (
    <>
      {cellGrid.map((row) => {
        return row.map((cell) => {
          return (
            <Cell
              key={cell.id}
              cell={cell}
              cellLength={cellLength}
              gridLayerRef={gridLayerRef}
            />
          );
        });
      })}
    </>
  );
};
