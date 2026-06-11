import { z } from "zod";
/**
 * Stable positional reference to an object in the Live Set. The kernel
 * resolves these against the current model on every call (handles are
 * ephemeral); the MCP server uses this schema for tool inputs and outputs.
 */
export declare const AddressSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"track">;
    index: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"returnTrack">;
    index: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"mainTrack">;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"clipSlot">;
    track: z.ZodNumber;
    slot: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"arrangementClip">;
    track: z.ZodNumber;
    index: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"scene">;
    index: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"cuePoint">;
    index: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"device">;
    track: z.ZodNumber;
    index: z.ZodNumber;
    chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"param">;
    track: z.ZodNumber;
    device: z.ZodNumber;
    index: z.ZodNumber;
    chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"mixerParam">;
    trackKind: z.ZodEnum<{
        track: "track";
        main: "main";
        return: "return";
    }>;
    trackIndex: z.ZodOptional<z.ZodNumber>;
    which: z.ZodEnum<{
        volume: "volume";
        panning: "panning";
        send: "send";
    }>;
    sendIndex: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>], "kind">;
export type Address = z.infer<typeof AddressSchema>;
