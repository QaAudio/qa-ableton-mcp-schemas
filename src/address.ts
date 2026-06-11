import { z } from "zod";

const nonNegInt = z.number().int().nonnegative();

/**
 * Stable positional reference to an object in the Live Set. The kernel
 * resolves these against the current model on every call (handles are
 * ephemeral); the MCP server uses this schema for tool inputs and outputs.
 */
export const AddressSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("track"), index: nonNegInt, name: z.string().optional() }),
  z.object({ kind: z.literal("returnTrack"), index: nonNegInt }),
  z.object({ kind: z.literal("mainTrack") }),
  z.object({ kind: z.literal("clipSlot"), track: nonNegInt, slot: nonNegInt }),
  z.object({ kind: z.literal("arrangementClip"), track: nonNegInt, index: nonNegInt }),
  z.object({ kind: z.literal("scene"), index: nonNegInt }),
  z.object({ kind: z.literal("cuePoint"), index: nonNegInt }),
  // `chain` descends into racks as alternating [chainIndex, deviceIndex, ...] pairs.
  z.object({ kind: z.literal("device"), track: nonNegInt, index: nonNegInt, chain: z.array(z.number().int()).optional() }),
  z.object({ kind: z.literal("param"), track: nonNegInt, device: nonNegInt, index: nonNegInt, chain: z.array(z.number().int()).optional() }),
  z.object({
    kind: z.literal("mixerParam"),
    trackKind: z.enum(["track", "return", "main"]),
    trackIndex: z.number().int().optional(),
    which: z.enum(["volume", "panning", "send"]),
    sendIndex: z.number().int().optional(),
  }),
]).describe("Stable positional reference to a Live object. Get valid addresses from ableton_scan_context.");

export type Address = z.infer<typeof AddressSchema>;
