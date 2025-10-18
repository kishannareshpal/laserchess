import type { Size } from "../models/size";

export class SizeHelper {
    static zero(): Size {
        return this.square(0);
    }

    static square(length: number): Size {
        return {
            width: length,
            height: length
        }
    }
}