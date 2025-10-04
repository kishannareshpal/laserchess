import type { Size } from "../models/size";

export class SizeHelper {
    static square(length: number): Size {
        return {
            width: length,
            height: length
        }
    }
}