import { z } from "zod";
import { AddressSchema } from "./address.js";

/**
 * Wire format of the kernel read tools, declared once: the kernel serializers
 * (`qa-ableton-mcp-kernel/src/serialize/`) type their return values against the
 * inferred `Serialized*` types, and the MCP server declares the same schemas as
 * its tool `outputSchema`s — drift fails the kernel typecheck or MCP runtime
 * validation instead of going unnoticed.
 */

// ---- SDK primitives (sdk-types.md) ---------------------------------------

/** `NoteDescription` */
export const noteSchema = z.object({
  pitch: z.number(),
  startTime: z.number(),
  duration: z.number(),
  velocity: z.number().optional(),
  muted: z.boolean().optional(),
  probability: z.number().optional(),
  velocityDeviation: z.number().optional(),
  releaseVelocity: z.number().optional(),
  selected: z.boolean().optional(),
});
export type SerializedNote = z.infer<typeof noteSchema>;

/** `WarpMarker` */
export const warpMarkerSchema = z.object({
  sampleTime: z.number(),
  beatTime: z.number(),
});

/** `DeviceParameterValueItem` */
const valueItemSchema = z.object({
  name: z.string(),
  shortName: z.string(),
});

/** Serializer label for a device's concrete SDK class. */
export const deviceTypeSchema = z.enum(["Simpler", "DrumRack", "RackDevice", "Device"]);
export type DeviceType = z.infer<typeof deviceTypeSchema>;

export const clipKindSchema = z.enum(["midi", "audio", "clip"]);
export type ClipKind = z.infer<typeof clipKindSchema>;

export const trackTypeSchema = z.enum(["midi", "audio", "other"]);
export type TrackType = z.infer<typeof trackTypeSchema>;

// ---- serialized shapes ----------------------------------------------------

/** Mixer values — parameter reads may time out → null */
export const mixerSchema = z.object({
  volume: z.number().nullable(),
  panning: z.number().nullable(),
  sends: z.array(z.number().nullable()),
});
export type SerializedMixer = z.infer<typeof mixerSchema>;

/** Device parameter with current value — concise omits defaultValue/valueItems */
export const paramSchema = z.object({
  name: z.string(),
  min: z.number(),
  max: z.number(),
  isQuantized: z.boolean(),
  value: z.number().nullable(),
  defaultValue: z.number().optional(),
  valueItems: z.array(valueItemSchema).optional(),
});
export type SerializedParam = z.infer<typeof paramSchema>;

export const deviceAddrSchema = z.object({
  kind: z.literal("device"),
  track: z.number().int().nonnegative(),
  index: z.number().int().nonnegative(),
  chain: z.array(z.number().int()).optional(),
});
export type DeviceAddress = z.infer<typeof deviceAddrSchema>;

export const pitchSummarySchema = z.object({
  pitches: z.array(z.number().int().min(0).max(127)),
  counts: z.record(z.string(), z.number().int().nonnegative()),
});
export type SerializedPitchSummary = z.infer<typeof pitchSummarySchema>;

/** Intermediate representation text blocks keyed by representation id. */
export const representationsSchema = z
  .object({
    notation: z.string().optional(),
    drumGrid: z.string().optional(),
    harmony: z.string().optional(),
    pianoRoll: z.string().optional(),
    structure: z.string().optional(),
  })
  .optional();
export type SerializedRepresentations = z.infer<typeof representationsSchema>;

export interface SerializedDeviceChain {
  index: number;
  mixer: SerializedMixer;
  receivingNote?: number;
  devices: SerializedDevice[];
}

/** Full device detail — recursive for rack chains (detailed only, depth-limited). */
export interface SerializedDevice {
  addr: DeviceAddress;
  name: string;
  type: DeviceType;
  parameters: SerializedParam[];
  chains?: SerializedDeviceChain[];
}

export const deviceOutputSchema: z.ZodType<SerializedDevice> = z.lazy(() =>
  z.object({
    addr: deviceAddrSchema,
    name: z.string(),
    type: deviceTypeSchema,
    parameters: z.array(paramSchema),
    chains: z
      .array(
        z.object({
          index: z.number().int().nonnegative(),
          mixer: mixerSchema,
          receivingNote: z.number().int().min(0).max(127).optional(),
          devices: z.array(deviceOutputSchema),
        }),
      )
      .optional(),
  }),
);

/** Clip summary/full — `notes`/`warpMarkers` present only in full reads. */
export const clipOutputSchema = z.object({
  name: z.string(),
  type: clipKindSchema,
  startTime: z.number(),
  endTime: z.number(),
  duration: z.number(),
  looping: z.boolean(),
  muted: z.boolean(),
  loopStart: z.number().optional(),
  loopEnd: z.number().optional(),
  color: z.number().optional(),
  noteCount: z.number().int().nonnegative().optional(),
  notes: z.array(noteSchema).optional(),
  notesTruncated: z.boolean().optional(),
  totalNoteCount: z.number().int().nonnegative().optional(),
  warping: z.boolean().optional(),
  warpMode: z.string().optional(),
  filePath: z.string().optional(),
  warpMarkers: z.array(warpMarkerSchema).optional(),
  pitchSummary: pitchSummarySchema.optional(),
  representations: representationsSchema,
});
export type SerializedClip = z.infer<typeof clipOutputSchema>;

export const trackAddrSchema = z.object({
  kind: z.literal("track"),
  index: z.number().int().nonnegative(),
  name: z.string().optional(),
});

const clipSlotSchema = z.object({
  slot: z.number().int().nonnegative(),
  hasClip: z.boolean(),
  clip: clipOutputSchema.nullable(),
});

/** Device row inside a track overview. */
export const deviceSummarySchema = z.object({
  index: z.number().int().nonnegative(),
  name: z.string(),
  type: deviceTypeSchema,
  paramCount: z.number().int().nonnegative(),
  addr: deviceAddrSchema,
});
export type SerializedDeviceSummary = z.infer<typeof deviceSummarySchema>;

export const clipPlacementSchema = z.object({
  sessionFilledSlots: z.number().int().nonnegative(),
  sessionNoteCount: z.number().int().nonnegative(),
  arrangementClipCount: z.number().int().nonnegative(),
  status: z.enum(["empty", "session_only", "arrangement_only", "both"]),
});
export type SerializedClipPlacement = z.infer<typeof clipPlacementSchema>;

/** Lightweight arrangement clip row for UI minimaps (scan_context overview). */
export const arrangementClipSummarySchema = z.object({
  startTime: z.number(),
  endTime: z.number(),
  color: z.number().optional(),
});
export type SerializedArrangementClipSummary = z.infer<typeof arrangementClipSummarySchema>;

export const trackOverviewSchema = z.object({
  addr: trackAddrSchema,
  index: z.number().int().nonnegative(),
  name: z.string(),
  type: trackTypeSchema,
  mute: z.boolean(),
  solo: z.boolean(),
  arm: z.boolean(),
  groupTrackIndex: z.number().int().nullable(),
  mixer: mixerSchema,
  clipSlots: z.array(clipSlotSchema),
  arrangementClipCount: z.number().int().nonnegative().optional(),
  /** Arrangement clip segments for UI minimaps (capped in concise mode). */
  arrangementClips: z.array(arrangementClipSummarySchema).optional(),
  /** Track accent color from first arrangement clip, else first occupied session clip. */
  color: z.number().nullable().optional(),
  clipPlacement: clipPlacementSchema.optional(),
  devices: z.array(deviceSummarySchema).optional(),
  mutedViaSolo: z.boolean().optional(),
});
export type SerializedTrackOverview = z.infer<typeof trackOverviewSchema>;

const sceneAddrSchema = z.object({
  kind: z.literal("scene"),
  index: z.number().int().nonnegative(),
});

const cuePointAddrSchema = z.object({
  kind: z.literal("cuePoint"),
  index: z.number().int().nonnegative(),
});

const returnTrackAddrSchema = z.object({
  kind: z.literal("returnTrack"),
  index: z.number().int().nonnegative(),
});

const mainTrackAddrSchema = z.object({ kind: z.literal("mainTrack") });

/** Light return/main track serialization (no per-device addressing). */
export const auxTrackSchema = z.object({
  addr: z.discriminatedUnion("kind", [returnTrackAddrSchema, mainTrackAddrSchema]),
  name: z.string(),
  mute: z.boolean(),
  solo: z.boolean(),
  mixer: mixerSchema,
  deviceNames: z.array(z.string()),
});
export type SerializedAuxTrack = z.infer<typeof auxTrackSchema>;

const songScaleSchema = z.object({
  rootNote: z.number(),
  scaleName: z.string(),
  scaleMode: z.boolean(),
  scaleIntervals: z.array(z.number()).optional(),
});
export type SerializedSongScale = z.infer<typeof songScaleSchema>;

const songGridSchema = z.object({
  quantization: z.string(),
  isTriplet: z.boolean(),
});

// ---- per-tool output schemas ----------------------------------------------

export const getContextOutputSchema = z.object({
  tempo: z.number(),
  scale: songScaleSchema,
  grid: songGridSchema,
  trackCount: z.number().int().nonnegative(),
  sceneCount: z.number().int().nonnegative(),
  tracks: z.array(trackOverviewSchema),
  scenes: z.array(
    z.object({
      addr: sceneAddrSchema,
      index: z.number().int().nonnegative(),
      name: z.string(),
      tempo: z.number(),
      signature: z.string(),
    }),
  ),
  cuePoints: z.array(
    z.object({
      addr: cuePointAddrSchema,
      index: z.number().int().nonnegative(),
      name: z.string(),
      time: z.number(),
    }),
  ),
  returnTracks: z.array(auxTrackSchema).optional(),
  mainTrack: auxTrackSchema.optional(),
  perceiveHints: z.array(z.string()).optional(),
  representations: representationsSchema,
});
export type SerializedSongOverview = z.infer<typeof getContextOutputSchema>;

export const getTrackOutputSchema = trackOverviewSchema.extend({
  sessionClips: z.array(
    z.object({
      slot: z.number().int().nonnegative(),
      clip: clipOutputSchema.nullable(),
    }),
  ),
  arrangementClips: z.array(
    z.object({
      index: z.number().int().nonnegative(),
      clip: clipOutputSchema.nullable(),
    }),
  ),
  arrangementTruncated: z.boolean().optional(),
  totalArrangementClips: z.number().int().nonnegative().optional(),
  takeLanes: z
    .array(
      z.object({
        index: z.number().int().nonnegative(),
        name: z.string(),
        clips: z.array(clipOutputSchema),
      }),
    )
    .optional(),
  devices: z.array(z.union([deviceOutputSchema, deviceSummarySchema])),
  representations: representationsSchema,
});
export type SerializedTrackFull = z.infer<typeof getTrackOutputSchema>;

export const getDeviceOutputSchema = deviceOutputSchema;

export const getClipNotesOutputSchema = clipOutputSchema;

/** `selection.ts` `CapturedSelection` — addresses use the full kernel `Address` union */
export const getSelectionOutputSchema = z.object({
  selection: z
    .object({
      scope: z.string(),
      capturedAt: z.number(),
      addresses: z.array(AddressSchema),
      timeSelection: z.object({ start: z.number(), end: z.number() }).optional(),
    })
    .nullable(),
});

export const renderAudioOutputSchema = z.object({
  wavPath: z.string(),
});

const clipWriteAddrSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("clipSlot"), track: z.number().int().nonnegative(), slot: z.number().int().nonnegative() }),
  z.object({
    kind: z.literal("arrangementClip"),
    track: z.number().int().nonnegative(),
    index: z.number().int().nonnegative(),
  }),
]);

export const findClipOutputSchema = z.object({
  addr: clipWriteAddrSchema,
  view: z.enum(["session", "arrangement"]),
  clip: clipOutputSchema,
  noteCount: z.number().int().nonnegative(),
  pitchSummary: pitchSummarySchema.optional(),
  representations: representationsSchema,
});

export const getDrumRackMapOutputSchema = z.object({
  addr: deviceAddrSchema,
  name: z.string(),
  type: z.literal("DrumRack"),
  pads: z.array(
    z.object({
      chainIndex: z.number().int().nonnegative(),
      receivingNote: z.number().int().min(0).max(127),
      devices: z.array(z.object({ name: z.string(), type: deviceTypeSchema })),
      sampleLabel: z.string().optional(),
    }),
  ),
});

export const remapClipNotesOutputSchema = z.object({
  scope: z.enum(["clip", "trackArrangement"]),
  clips: z.array(
    z.object({
      addr: clipWriteAddrSchema,
      name: z.string(),
      notesRemapped: z.number().int().nonnegative(),
      pitchSummary: pitchSummarySchema,
    }),
  ),
  totalNotesRemapped: z.number().int().nonnegative(),
  unmappedPitchesUsed: z.array(z.number().int().min(0).max(127)),
});
