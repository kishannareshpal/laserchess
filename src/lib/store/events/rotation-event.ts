import { event } from "@legendapp/state";

export const rotationEvent = {
    left: event(),
    right: event(),
} as const;