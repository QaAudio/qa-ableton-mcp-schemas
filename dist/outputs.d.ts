import { z } from "zod";
/**
 * Wire format of the kernel read tools, declared once: the kernel serializers
 * (`qa-ableton-mcp-kernel/src/serialize/`) type their return values against the
 * inferred `Serialized*` types, and the MCP server declares the same schemas as
 * its tool `outputSchema`s — drift fails the kernel typecheck or MCP runtime
 * validation instead of going unnoticed.
 */
/** `NoteDescription` */
export declare const noteSchema: z.ZodObject<{
    pitch: z.ZodNumber;
    startTime: z.ZodNumber;
    duration: z.ZodNumber;
    velocity: z.ZodOptional<z.ZodNumber>;
    muted: z.ZodOptional<z.ZodBoolean>;
    probability: z.ZodOptional<z.ZodNumber>;
    velocityDeviation: z.ZodOptional<z.ZodNumber>;
    releaseVelocity: z.ZodOptional<z.ZodNumber>;
    selected: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type SerializedNote = z.infer<typeof noteSchema>;
/** `WarpMarker` */
export declare const warpMarkerSchema: z.ZodObject<{
    sampleTime: z.ZodNumber;
    beatTime: z.ZodNumber;
}, z.core.$strip>;
/** Serializer label for a device's concrete SDK class. */
export declare const deviceTypeSchema: z.ZodEnum<{
    Simpler: "Simpler";
    DrumRack: "DrumRack";
    RackDevice: "RackDevice";
    Device: "Device";
}>;
export type DeviceType = z.infer<typeof deviceTypeSchema>;
export declare const clipKindSchema: z.ZodEnum<{
    midi: "midi";
    clip: "clip";
    audio: "audio";
}>;
export type ClipKind = z.infer<typeof clipKindSchema>;
export declare const trackTypeSchema: z.ZodEnum<{
    midi: "midi";
    other: "other";
    audio: "audio";
}>;
export type TrackType = z.infer<typeof trackTypeSchema>;
/** Mixer values — parameter reads may time out → null */
export declare const mixerSchema: z.ZodObject<{
    volume: z.ZodNullable<z.ZodNumber>;
    panning: z.ZodNullable<z.ZodNumber>;
    sends: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type SerializedMixer = z.infer<typeof mixerSchema>;
/** Device parameter with current value — concise omits defaultValue/valueItems */
export declare const paramSchema: z.ZodObject<{
    name: z.ZodString;
    min: z.ZodNumber;
    max: z.ZodNumber;
    isQuantized: z.ZodBoolean;
    value: z.ZodNullable<z.ZodNumber>;
    defaultValue: z.ZodOptional<z.ZodNumber>;
    valueItems: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        shortName: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type SerializedParam = z.infer<typeof paramSchema>;
export declare const deviceAddrSchema: z.ZodObject<{
    kind: z.ZodLiteral<"device">;
    track: z.ZodNumber;
    index: z.ZodNumber;
    chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export type DeviceAddress = z.infer<typeof deviceAddrSchema>;
export declare const pitchSummarySchema: z.ZodObject<{
    pitches: z.ZodArray<z.ZodNumber>;
    counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
export type SerializedPitchSummary = z.infer<typeof pitchSummarySchema>;
/** Intermediate representation text blocks keyed by representation id. */
export declare const representationsSchema: z.ZodOptional<z.ZodObject<{
    notation: z.ZodOptional<z.ZodString>;
    drumGrid: z.ZodOptional<z.ZodString>;
    harmony: z.ZodOptional<z.ZodString>;
    pianoRoll: z.ZodOptional<z.ZodString>;
    structure: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
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
export declare const deviceOutputSchema: z.ZodType<SerializedDevice>;
/** Clip summary/full — `notes`/`warpMarkers` present only in full reads. */
export declare const clipOutputSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        midi: "midi";
        clip: "clip";
        audio: "audio";
    }>;
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    duration: z.ZodNumber;
    looping: z.ZodBoolean;
    muted: z.ZodBoolean;
    loopStart: z.ZodOptional<z.ZodNumber>;
    loopEnd: z.ZodOptional<z.ZodNumber>;
    color: z.ZodOptional<z.ZodNumber>;
    noteCount: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        pitch: z.ZodNumber;
        startTime: z.ZodNumber;
        duration: z.ZodNumber;
        velocity: z.ZodOptional<z.ZodNumber>;
        muted: z.ZodOptional<z.ZodBoolean>;
        probability: z.ZodOptional<z.ZodNumber>;
        velocityDeviation: z.ZodOptional<z.ZodNumber>;
        releaseVelocity: z.ZodOptional<z.ZodNumber>;
        selected: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    notesTruncated: z.ZodOptional<z.ZodBoolean>;
    totalNoteCount: z.ZodOptional<z.ZodNumber>;
    warping: z.ZodOptional<z.ZodBoolean>;
    warpMode: z.ZodOptional<z.ZodString>;
    filePath: z.ZodOptional<z.ZodString>;
    warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sampleTime: z.ZodNumber;
        beatTime: z.ZodNumber;
    }, z.core.$strip>>>;
    pitchSummary: z.ZodOptional<z.ZodObject<{
        pitches: z.ZodArray<z.ZodNumber>;
        counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, z.core.$strip>>;
    representations: z.ZodOptional<z.ZodObject<{
        notation: z.ZodOptional<z.ZodString>;
        drumGrid: z.ZodOptional<z.ZodString>;
        harmony: z.ZodOptional<z.ZodString>;
        pianoRoll: z.ZodOptional<z.ZodString>;
        structure: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SerializedClip = z.infer<typeof clipOutputSchema>;
export declare const trackAddrSchema: z.ZodObject<{
    kind: z.ZodLiteral<"track">;
    index: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Device row inside a track overview. */
export declare const deviceSummarySchema: z.ZodObject<{
    index: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodEnum<{
        Simpler: "Simpler";
        DrumRack: "DrumRack";
        RackDevice: "RackDevice";
        Device: "Device";
    }>;
    paramCount: z.ZodNumber;
    addr: z.ZodObject<{
        kind: z.ZodLiteral<"device">;
        track: z.ZodNumber;
        index: z.ZodNumber;
        chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SerializedDeviceSummary = z.infer<typeof deviceSummarySchema>;
export declare const clipPlacementSchema: z.ZodObject<{
    sessionFilledSlots: z.ZodNumber;
    sessionNoteCount: z.ZodNumber;
    arrangementClipCount: z.ZodNumber;
    status: z.ZodEnum<{
        both: "both";
        empty: "empty";
        session_only: "session_only";
        arrangement_only: "arrangement_only";
    }>;
}, z.core.$strip>;
export type SerializedClipPlacement = z.infer<typeof clipPlacementSchema>;
export declare const trackOverviewSchema: z.ZodObject<{
    addr: z.ZodObject<{
        kind: z.ZodLiteral<"track">;
        index: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    index: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodEnum<{
        midi: "midi";
        other: "other";
        audio: "audio";
    }>;
    mute: z.ZodBoolean;
    solo: z.ZodBoolean;
    arm: z.ZodBoolean;
    groupTrackIndex: z.ZodNullable<z.ZodNumber>;
    mixer: z.ZodObject<{
        volume: z.ZodNullable<z.ZodNumber>;
        panning: z.ZodNullable<z.ZodNumber>;
        sends: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>;
    clipSlots: z.ZodArray<z.ZodObject<{
        slot: z.ZodNumber;
        hasClip: z.ZodBoolean;
        clip: z.ZodNullable<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                midi: "midi";
                clip: "clip";
                audio: "audio";
            }>;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            duration: z.ZodNumber;
            looping: z.ZodBoolean;
            muted: z.ZodBoolean;
            loopStart: z.ZodOptional<z.ZodNumber>;
            loopEnd: z.ZodOptional<z.ZodNumber>;
            color: z.ZodOptional<z.ZodNumber>;
            noteCount: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                pitch: z.ZodNumber;
                startTime: z.ZodNumber;
                duration: z.ZodNumber;
                velocity: z.ZodOptional<z.ZodNumber>;
                muted: z.ZodOptional<z.ZodBoolean>;
                probability: z.ZodOptional<z.ZodNumber>;
                velocityDeviation: z.ZodOptional<z.ZodNumber>;
                releaseVelocity: z.ZodOptional<z.ZodNumber>;
                selected: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>>;
            notesTruncated: z.ZodOptional<z.ZodBoolean>;
            totalNoteCount: z.ZodOptional<z.ZodNumber>;
            warping: z.ZodOptional<z.ZodBoolean>;
            warpMode: z.ZodOptional<z.ZodString>;
            filePath: z.ZodOptional<z.ZodString>;
            warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                sampleTime: z.ZodNumber;
                beatTime: z.ZodNumber;
            }, z.core.$strip>>>;
            pitchSummary: z.ZodOptional<z.ZodObject<{
                pitches: z.ZodArray<z.ZodNumber>;
                counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, z.core.$strip>>;
            representations: z.ZodOptional<z.ZodObject<{
                notation: z.ZodOptional<z.ZodString>;
                drumGrid: z.ZodOptional<z.ZodString>;
                harmony: z.ZodOptional<z.ZodString>;
                pianoRoll: z.ZodOptional<z.ZodString>;
                structure: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    arrangementClipCount: z.ZodOptional<z.ZodNumber>;
    clipPlacement: z.ZodOptional<z.ZodObject<{
        sessionFilledSlots: z.ZodNumber;
        sessionNoteCount: z.ZodNumber;
        arrangementClipCount: z.ZodNumber;
        status: z.ZodEnum<{
            both: "both";
            empty: "empty";
            session_only: "session_only";
            arrangement_only: "arrangement_only";
        }>;
    }, z.core.$strip>>;
    devices: z.ZodOptional<z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodEnum<{
            Simpler: "Simpler";
            DrumRack: "DrumRack";
            RackDevice: "RackDevice";
            Device: "Device";
        }>;
        paramCount: z.ZodNumber;
        addr: z.ZodObject<{
            kind: z.ZodLiteral<"device">;
            track: z.ZodNumber;
            index: z.ZodNumber;
            chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        }, z.core.$strip>;
    }, z.core.$strip>>>;
    mutedViaSolo: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type SerializedTrackOverview = z.infer<typeof trackOverviewSchema>;
/** Light return/main track serialization (no per-device addressing). */
export declare const auxTrackSchema: z.ZodObject<{
    addr: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"returnTrack">;
        index: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"mainTrack">;
    }, z.core.$strip>], "kind">;
    name: z.ZodString;
    mute: z.ZodBoolean;
    solo: z.ZodBoolean;
    mixer: z.ZodObject<{
        volume: z.ZodNullable<z.ZodNumber>;
        panning: z.ZodNullable<z.ZodNumber>;
        sends: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>;
    deviceNames: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type SerializedAuxTrack = z.infer<typeof auxTrackSchema>;
declare const songScaleSchema: z.ZodObject<{
    rootNote: z.ZodNumber;
    scaleName: z.ZodString;
    scaleMode: z.ZodBoolean;
    scaleIntervals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export type SerializedSongScale = z.infer<typeof songScaleSchema>;
export declare const getContextOutputSchema: z.ZodObject<{
    tempo: z.ZodNumber;
    scale: z.ZodObject<{
        rootNote: z.ZodNumber;
        scaleName: z.ZodString;
        scaleMode: z.ZodBoolean;
        scaleIntervals: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>;
    grid: z.ZodObject<{
        quantization: z.ZodString;
        isTriplet: z.ZodBoolean;
    }, z.core.$strip>;
    trackCount: z.ZodNumber;
    sceneCount: z.ZodNumber;
    tracks: z.ZodArray<z.ZodObject<{
        addr: z.ZodObject<{
            kind: z.ZodLiteral<"track">;
            index: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        index: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodEnum<{
            midi: "midi";
            other: "other";
            audio: "audio";
        }>;
        mute: z.ZodBoolean;
        solo: z.ZodBoolean;
        arm: z.ZodBoolean;
        groupTrackIndex: z.ZodNullable<z.ZodNumber>;
        mixer: z.ZodObject<{
            volume: z.ZodNullable<z.ZodNumber>;
            panning: z.ZodNullable<z.ZodNumber>;
            sends: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>;
        clipSlots: z.ZodArray<z.ZodObject<{
            slot: z.ZodNumber;
            hasClip: z.ZodBoolean;
            clip: z.ZodNullable<z.ZodObject<{
                name: z.ZodString;
                type: z.ZodEnum<{
                    midi: "midi";
                    clip: "clip";
                    audio: "audio";
                }>;
                startTime: z.ZodNumber;
                endTime: z.ZodNumber;
                duration: z.ZodNumber;
                looping: z.ZodBoolean;
                muted: z.ZodBoolean;
                loopStart: z.ZodOptional<z.ZodNumber>;
                loopEnd: z.ZodOptional<z.ZodNumber>;
                color: z.ZodOptional<z.ZodNumber>;
                noteCount: z.ZodOptional<z.ZodNumber>;
                notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    pitch: z.ZodNumber;
                    startTime: z.ZodNumber;
                    duration: z.ZodNumber;
                    velocity: z.ZodOptional<z.ZodNumber>;
                    muted: z.ZodOptional<z.ZodBoolean>;
                    probability: z.ZodOptional<z.ZodNumber>;
                    velocityDeviation: z.ZodOptional<z.ZodNumber>;
                    releaseVelocity: z.ZodOptional<z.ZodNumber>;
                    selected: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>>>;
                notesTruncated: z.ZodOptional<z.ZodBoolean>;
                totalNoteCount: z.ZodOptional<z.ZodNumber>;
                warping: z.ZodOptional<z.ZodBoolean>;
                warpMode: z.ZodOptional<z.ZodString>;
                filePath: z.ZodOptional<z.ZodString>;
                warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    sampleTime: z.ZodNumber;
                    beatTime: z.ZodNumber;
                }, z.core.$strip>>>;
                pitchSummary: z.ZodOptional<z.ZodObject<{
                    pitches: z.ZodArray<z.ZodNumber>;
                    counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
                }, z.core.$strip>>;
                representations: z.ZodOptional<z.ZodObject<{
                    notation: z.ZodOptional<z.ZodString>;
                    drumGrid: z.ZodOptional<z.ZodString>;
                    harmony: z.ZodOptional<z.ZodString>;
                    pianoRoll: z.ZodOptional<z.ZodString>;
                    structure: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        arrangementClipCount: z.ZodOptional<z.ZodNumber>;
        clipPlacement: z.ZodOptional<z.ZodObject<{
            sessionFilledSlots: z.ZodNumber;
            sessionNoteCount: z.ZodNumber;
            arrangementClipCount: z.ZodNumber;
            status: z.ZodEnum<{
                both: "both";
                empty: "empty";
                session_only: "session_only";
                arrangement_only: "arrangement_only";
            }>;
        }, z.core.$strip>>;
        devices: z.ZodOptional<z.ZodArray<z.ZodObject<{
            index: z.ZodNumber;
            name: z.ZodString;
            type: z.ZodEnum<{
                Simpler: "Simpler";
                DrumRack: "DrumRack";
                RackDevice: "RackDevice";
                Device: "Device";
            }>;
            paramCount: z.ZodNumber;
            addr: z.ZodObject<{
                kind: z.ZodLiteral<"device">;
                track: z.ZodNumber;
                index: z.ZodNumber;
                chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        mutedViaSolo: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    scenes: z.ZodArray<z.ZodObject<{
        addr: z.ZodObject<{
            kind: z.ZodLiteral<"scene">;
            index: z.ZodNumber;
        }, z.core.$strip>;
        index: z.ZodNumber;
        name: z.ZodString;
        tempo: z.ZodNumber;
        signature: z.ZodString;
    }, z.core.$strip>>;
    cuePoints: z.ZodArray<z.ZodObject<{
        addr: z.ZodObject<{
            kind: z.ZodLiteral<"cuePoint">;
            index: z.ZodNumber;
        }, z.core.$strip>;
        index: z.ZodNumber;
        name: z.ZodString;
        time: z.ZodNumber;
    }, z.core.$strip>>;
    returnTracks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        addr: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"returnTrack">;
            index: z.ZodNumber;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"mainTrack">;
        }, z.core.$strip>], "kind">;
        name: z.ZodString;
        mute: z.ZodBoolean;
        solo: z.ZodBoolean;
        mixer: z.ZodObject<{
            volume: z.ZodNullable<z.ZodNumber>;
            panning: z.ZodNullable<z.ZodNumber>;
            sends: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>;
        deviceNames: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>>;
    mainTrack: z.ZodOptional<z.ZodObject<{
        addr: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"returnTrack">;
            index: z.ZodNumber;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"mainTrack">;
        }, z.core.$strip>], "kind">;
        name: z.ZodString;
        mute: z.ZodBoolean;
        solo: z.ZodBoolean;
        mixer: z.ZodObject<{
            volume: z.ZodNullable<z.ZodNumber>;
            panning: z.ZodNullable<z.ZodNumber>;
            sends: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>;
        deviceNames: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    perceiveHints: z.ZodOptional<z.ZodArray<z.ZodString>>;
    representations: z.ZodOptional<z.ZodObject<{
        notation: z.ZodOptional<z.ZodString>;
        drumGrid: z.ZodOptional<z.ZodString>;
        harmony: z.ZodOptional<z.ZodString>;
        pianoRoll: z.ZodOptional<z.ZodString>;
        structure: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SerializedSongOverview = z.infer<typeof getContextOutputSchema>;
export declare const getTrackOutputSchema: z.ZodObject<{
    addr: z.ZodObject<{
        kind: z.ZodLiteral<"track">;
        index: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    index: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodEnum<{
        midi: "midi";
        other: "other";
        audio: "audio";
    }>;
    mute: z.ZodBoolean;
    solo: z.ZodBoolean;
    arm: z.ZodBoolean;
    groupTrackIndex: z.ZodNullable<z.ZodNumber>;
    mixer: z.ZodObject<{
        volume: z.ZodNullable<z.ZodNumber>;
        panning: z.ZodNullable<z.ZodNumber>;
        sends: z.ZodArray<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>;
    clipSlots: z.ZodArray<z.ZodObject<{
        slot: z.ZodNumber;
        hasClip: z.ZodBoolean;
        clip: z.ZodNullable<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                midi: "midi";
                clip: "clip";
                audio: "audio";
            }>;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            duration: z.ZodNumber;
            looping: z.ZodBoolean;
            muted: z.ZodBoolean;
            loopStart: z.ZodOptional<z.ZodNumber>;
            loopEnd: z.ZodOptional<z.ZodNumber>;
            color: z.ZodOptional<z.ZodNumber>;
            noteCount: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                pitch: z.ZodNumber;
                startTime: z.ZodNumber;
                duration: z.ZodNumber;
                velocity: z.ZodOptional<z.ZodNumber>;
                muted: z.ZodOptional<z.ZodBoolean>;
                probability: z.ZodOptional<z.ZodNumber>;
                velocityDeviation: z.ZodOptional<z.ZodNumber>;
                releaseVelocity: z.ZodOptional<z.ZodNumber>;
                selected: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>>;
            notesTruncated: z.ZodOptional<z.ZodBoolean>;
            totalNoteCount: z.ZodOptional<z.ZodNumber>;
            warping: z.ZodOptional<z.ZodBoolean>;
            warpMode: z.ZodOptional<z.ZodString>;
            filePath: z.ZodOptional<z.ZodString>;
            warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                sampleTime: z.ZodNumber;
                beatTime: z.ZodNumber;
            }, z.core.$strip>>>;
            pitchSummary: z.ZodOptional<z.ZodObject<{
                pitches: z.ZodArray<z.ZodNumber>;
                counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, z.core.$strip>>;
            representations: z.ZodOptional<z.ZodObject<{
                notation: z.ZodOptional<z.ZodString>;
                drumGrid: z.ZodOptional<z.ZodString>;
                harmony: z.ZodOptional<z.ZodString>;
                pianoRoll: z.ZodOptional<z.ZodString>;
                structure: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    arrangementClipCount: z.ZodOptional<z.ZodNumber>;
    clipPlacement: z.ZodOptional<z.ZodObject<{
        sessionFilledSlots: z.ZodNumber;
        sessionNoteCount: z.ZodNumber;
        arrangementClipCount: z.ZodNumber;
        status: z.ZodEnum<{
            both: "both";
            empty: "empty";
            session_only: "session_only";
            arrangement_only: "arrangement_only";
        }>;
    }, z.core.$strip>>;
    mutedViaSolo: z.ZodOptional<z.ZodBoolean>;
    sessionClips: z.ZodArray<z.ZodObject<{
        slot: z.ZodNumber;
        clip: z.ZodNullable<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                midi: "midi";
                clip: "clip";
                audio: "audio";
            }>;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            duration: z.ZodNumber;
            looping: z.ZodBoolean;
            muted: z.ZodBoolean;
            loopStart: z.ZodOptional<z.ZodNumber>;
            loopEnd: z.ZodOptional<z.ZodNumber>;
            color: z.ZodOptional<z.ZodNumber>;
            noteCount: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                pitch: z.ZodNumber;
                startTime: z.ZodNumber;
                duration: z.ZodNumber;
                velocity: z.ZodOptional<z.ZodNumber>;
                muted: z.ZodOptional<z.ZodBoolean>;
                probability: z.ZodOptional<z.ZodNumber>;
                velocityDeviation: z.ZodOptional<z.ZodNumber>;
                releaseVelocity: z.ZodOptional<z.ZodNumber>;
                selected: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>>;
            notesTruncated: z.ZodOptional<z.ZodBoolean>;
            totalNoteCount: z.ZodOptional<z.ZodNumber>;
            warping: z.ZodOptional<z.ZodBoolean>;
            warpMode: z.ZodOptional<z.ZodString>;
            filePath: z.ZodOptional<z.ZodString>;
            warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                sampleTime: z.ZodNumber;
                beatTime: z.ZodNumber;
            }, z.core.$strip>>>;
            pitchSummary: z.ZodOptional<z.ZodObject<{
                pitches: z.ZodArray<z.ZodNumber>;
                counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, z.core.$strip>>;
            representations: z.ZodOptional<z.ZodObject<{
                notation: z.ZodOptional<z.ZodString>;
                drumGrid: z.ZodOptional<z.ZodString>;
                harmony: z.ZodOptional<z.ZodString>;
                pianoRoll: z.ZodOptional<z.ZodString>;
                structure: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    arrangementClips: z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        clip: z.ZodNullable<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                midi: "midi";
                clip: "clip";
                audio: "audio";
            }>;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            duration: z.ZodNumber;
            looping: z.ZodBoolean;
            muted: z.ZodBoolean;
            loopStart: z.ZodOptional<z.ZodNumber>;
            loopEnd: z.ZodOptional<z.ZodNumber>;
            color: z.ZodOptional<z.ZodNumber>;
            noteCount: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                pitch: z.ZodNumber;
                startTime: z.ZodNumber;
                duration: z.ZodNumber;
                velocity: z.ZodOptional<z.ZodNumber>;
                muted: z.ZodOptional<z.ZodBoolean>;
                probability: z.ZodOptional<z.ZodNumber>;
                velocityDeviation: z.ZodOptional<z.ZodNumber>;
                releaseVelocity: z.ZodOptional<z.ZodNumber>;
                selected: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>>;
            notesTruncated: z.ZodOptional<z.ZodBoolean>;
            totalNoteCount: z.ZodOptional<z.ZodNumber>;
            warping: z.ZodOptional<z.ZodBoolean>;
            warpMode: z.ZodOptional<z.ZodString>;
            filePath: z.ZodOptional<z.ZodString>;
            warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                sampleTime: z.ZodNumber;
                beatTime: z.ZodNumber;
            }, z.core.$strip>>>;
            pitchSummary: z.ZodOptional<z.ZodObject<{
                pitches: z.ZodArray<z.ZodNumber>;
                counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, z.core.$strip>>;
            representations: z.ZodOptional<z.ZodObject<{
                notation: z.ZodOptional<z.ZodString>;
                drumGrid: z.ZodOptional<z.ZodString>;
                harmony: z.ZodOptional<z.ZodString>;
                pianoRoll: z.ZodOptional<z.ZodString>;
                structure: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    arrangementTruncated: z.ZodOptional<z.ZodBoolean>;
    totalArrangementClips: z.ZodOptional<z.ZodNumber>;
    takeLanes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        name: z.ZodString;
        clips: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                midi: "midi";
                clip: "clip";
                audio: "audio";
            }>;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            duration: z.ZodNumber;
            looping: z.ZodBoolean;
            muted: z.ZodBoolean;
            loopStart: z.ZodOptional<z.ZodNumber>;
            loopEnd: z.ZodOptional<z.ZodNumber>;
            color: z.ZodOptional<z.ZodNumber>;
            noteCount: z.ZodOptional<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                pitch: z.ZodNumber;
                startTime: z.ZodNumber;
                duration: z.ZodNumber;
                velocity: z.ZodOptional<z.ZodNumber>;
                muted: z.ZodOptional<z.ZodBoolean>;
                probability: z.ZodOptional<z.ZodNumber>;
                velocityDeviation: z.ZodOptional<z.ZodNumber>;
                releaseVelocity: z.ZodOptional<z.ZodNumber>;
                selected: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>>;
            notesTruncated: z.ZodOptional<z.ZodBoolean>;
            totalNoteCount: z.ZodOptional<z.ZodNumber>;
            warping: z.ZodOptional<z.ZodBoolean>;
            warpMode: z.ZodOptional<z.ZodString>;
            filePath: z.ZodOptional<z.ZodString>;
            warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
                sampleTime: z.ZodNumber;
                beatTime: z.ZodNumber;
            }, z.core.$strip>>>;
            pitchSummary: z.ZodOptional<z.ZodObject<{
                pitches: z.ZodArray<z.ZodNumber>;
                counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, z.core.$strip>>;
            representations: z.ZodOptional<z.ZodObject<{
                notation: z.ZodOptional<z.ZodString>;
                drumGrid: z.ZodOptional<z.ZodString>;
                harmony: z.ZodOptional<z.ZodString>;
                pianoRoll: z.ZodOptional<z.ZodString>;
                structure: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    devices: z.ZodArray<z.ZodUnion<readonly [z.ZodType<SerializedDevice, unknown, z.core.$ZodTypeInternals<SerializedDevice, unknown>>, z.ZodObject<{
        index: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodEnum<{
            Simpler: "Simpler";
            DrumRack: "DrumRack";
            RackDevice: "RackDevice";
            Device: "Device";
        }>;
        paramCount: z.ZodNumber;
        addr: z.ZodObject<{
            kind: z.ZodLiteral<"device">;
            track: z.ZodNumber;
            index: z.ZodNumber;
            chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        }, z.core.$strip>;
    }, z.core.$strip>]>>;
    representations: z.ZodOptional<z.ZodObject<{
        notation: z.ZodOptional<z.ZodString>;
        drumGrid: z.ZodOptional<z.ZodString>;
        harmony: z.ZodOptional<z.ZodString>;
        pianoRoll: z.ZodOptional<z.ZodString>;
        structure: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SerializedTrackFull = z.infer<typeof getTrackOutputSchema>;
export declare const getDeviceOutputSchema: z.ZodType<SerializedDevice, unknown, z.core.$ZodTypeInternals<SerializedDevice, unknown>>;
export declare const getClipNotesOutputSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        midi: "midi";
        clip: "clip";
        audio: "audio";
    }>;
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    duration: z.ZodNumber;
    looping: z.ZodBoolean;
    muted: z.ZodBoolean;
    loopStart: z.ZodOptional<z.ZodNumber>;
    loopEnd: z.ZodOptional<z.ZodNumber>;
    color: z.ZodOptional<z.ZodNumber>;
    noteCount: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        pitch: z.ZodNumber;
        startTime: z.ZodNumber;
        duration: z.ZodNumber;
        velocity: z.ZodOptional<z.ZodNumber>;
        muted: z.ZodOptional<z.ZodBoolean>;
        probability: z.ZodOptional<z.ZodNumber>;
        velocityDeviation: z.ZodOptional<z.ZodNumber>;
        releaseVelocity: z.ZodOptional<z.ZodNumber>;
        selected: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    notesTruncated: z.ZodOptional<z.ZodBoolean>;
    totalNoteCount: z.ZodOptional<z.ZodNumber>;
    warping: z.ZodOptional<z.ZodBoolean>;
    warpMode: z.ZodOptional<z.ZodString>;
    filePath: z.ZodOptional<z.ZodString>;
    warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sampleTime: z.ZodNumber;
        beatTime: z.ZodNumber;
    }, z.core.$strip>>>;
    pitchSummary: z.ZodOptional<z.ZodObject<{
        pitches: z.ZodArray<z.ZodNumber>;
        counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, z.core.$strip>>;
    representations: z.ZodOptional<z.ZodObject<{
        notation: z.ZodOptional<z.ZodString>;
        drumGrid: z.ZodOptional<z.ZodString>;
        harmony: z.ZodOptional<z.ZodString>;
        pianoRoll: z.ZodOptional<z.ZodString>;
        structure: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** `selection.ts` `CapturedSelection` — addresses use the full kernel `Address` union */
export declare const getSelectionOutputSchema: z.ZodObject<{
    selection: z.ZodNullable<z.ZodObject<{
        scope: z.ZodString;
        capturedAt: z.ZodNumber;
        addresses: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strip>], "kind">>;
        timeSelection: z.ZodOptional<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const renderAudioOutputSchema: z.ZodObject<{
    wavPath: z.ZodString;
}, z.core.$strip>;
export declare const findClipOutputSchema: z.ZodObject<{
    addr: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"clipSlot">;
        track: z.ZodNumber;
        slot: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"arrangementClip">;
        track: z.ZodNumber;
        index: z.ZodNumber;
    }, z.core.$strip>], "kind">;
    view: z.ZodEnum<{
        session: "session";
        arrangement: "arrangement";
    }>;
    clip: z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            midi: "midi";
            clip: "clip";
            audio: "audio";
        }>;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        duration: z.ZodNumber;
        looping: z.ZodBoolean;
        muted: z.ZodBoolean;
        loopStart: z.ZodOptional<z.ZodNumber>;
        loopEnd: z.ZodOptional<z.ZodNumber>;
        color: z.ZodOptional<z.ZodNumber>;
        noteCount: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodArray<z.ZodObject<{
            pitch: z.ZodNumber;
            startTime: z.ZodNumber;
            duration: z.ZodNumber;
            velocity: z.ZodOptional<z.ZodNumber>;
            muted: z.ZodOptional<z.ZodBoolean>;
            probability: z.ZodOptional<z.ZodNumber>;
            velocityDeviation: z.ZodOptional<z.ZodNumber>;
            releaseVelocity: z.ZodOptional<z.ZodNumber>;
            selected: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        notesTruncated: z.ZodOptional<z.ZodBoolean>;
        totalNoteCount: z.ZodOptional<z.ZodNumber>;
        warping: z.ZodOptional<z.ZodBoolean>;
        warpMode: z.ZodOptional<z.ZodString>;
        filePath: z.ZodOptional<z.ZodString>;
        warpMarkers: z.ZodOptional<z.ZodArray<z.ZodObject<{
            sampleTime: z.ZodNumber;
            beatTime: z.ZodNumber;
        }, z.core.$strip>>>;
        pitchSummary: z.ZodOptional<z.ZodObject<{
            pitches: z.ZodArray<z.ZodNumber>;
            counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
        }, z.core.$strip>>;
        representations: z.ZodOptional<z.ZodObject<{
            notation: z.ZodOptional<z.ZodString>;
            drumGrid: z.ZodOptional<z.ZodString>;
            harmony: z.ZodOptional<z.ZodString>;
            pianoRoll: z.ZodOptional<z.ZodString>;
            structure: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    noteCount: z.ZodNumber;
    pitchSummary: z.ZodOptional<z.ZodObject<{
        pitches: z.ZodArray<z.ZodNumber>;
        counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, z.core.$strip>>;
    representations: z.ZodOptional<z.ZodObject<{
        notation: z.ZodOptional<z.ZodString>;
        drumGrid: z.ZodOptional<z.ZodString>;
        harmony: z.ZodOptional<z.ZodString>;
        pianoRoll: z.ZodOptional<z.ZodString>;
        structure: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const getDrumRackMapOutputSchema: z.ZodObject<{
    addr: z.ZodObject<{
        kind: z.ZodLiteral<"device">;
        track: z.ZodNumber;
        index: z.ZodNumber;
        chain: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>;
    name: z.ZodString;
    type: z.ZodLiteral<"DrumRack">;
    pads: z.ZodArray<z.ZodObject<{
        chainIndex: z.ZodNumber;
        receivingNote: z.ZodNumber;
        devices: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodEnum<{
                Simpler: "Simpler";
                DrumRack: "DrumRack";
                RackDevice: "RackDevice";
                Device: "Device";
            }>;
        }, z.core.$strip>>;
        sampleLabel: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const remapClipNotesOutputSchema: z.ZodObject<{
    scope: z.ZodEnum<{
        clip: "clip";
        trackArrangement: "trackArrangement";
    }>;
    clips: z.ZodArray<z.ZodObject<{
        addr: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"clipSlot">;
            track: z.ZodNumber;
            slot: z.ZodNumber;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"arrangementClip">;
            track: z.ZodNumber;
            index: z.ZodNumber;
        }, z.core.$strip>], "kind">;
        name: z.ZodString;
        notesRemapped: z.ZodNumber;
        pitchSummary: z.ZodObject<{
            pitches: z.ZodArray<z.ZodNumber>;
            counts: z.ZodRecord<z.ZodString, z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    totalNotesRemapped: z.ZodNumber;
    unmappedPitchesUsed: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export {};
