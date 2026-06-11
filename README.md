# @quantumaudio/ableton-mcp-schemas

Shared **Zod schemas and TypeScript types** for the [qa-ableton-mcp](https://github.com/QaAudio/qa-ableton-mcp) wire format. The in-Live kernel serializers and the MCP stdio server both validate against these definitions so perception payloads stay in sync.

License: [Apache-2.0](LICENSE).

## Install

```bash
npm install @quantumaudio/ableton-mcp-schemas
```

Requires **Node ≥ 24**. Depends on `zod` ^4.

## What's inside

| Module | Contents |
|--------|----------|
| `address` | Stable Live object addresses (`track`, `device`, `clipSlot`, `arrangementClip`, …) |
| `outputs` | Zod schemas for `scan_context`, `scan_track`, `read_clip_notes`, `read_device`, selection, drum rack, etc. |

Kernel code types serializer return values against these schemas; the MCP server uses them for `outputSchema` pre-validation and structured tool results.

## Usage

```ts
import {
  AddressSchema,
  ContextOutputSchema,
  getContextOutputSchema,
} from "@quantumaudio/ableton-mcp-schemas";

const addr = AddressSchema.parse({ kind: "track", index: 0 });
const schema = getContextOutputSchema("concise");
const parsed = schema.parse(kernelJson);
```

## Development

```bash
git clone https://github.com/QaAudio/qa-ableton-mcp-schemas.git
cd qa-ableton-mcp-schemas
npm ci
npm run typecheck
npm run build
```

When changing a schema:

1. Update kernel serializers in [qa-ableton-mcp](https://github.com/QaAudio/qa-ableton-mcp) (`packages/kernel`).
2. Update MCP output handling in `packages/server`.
3. Bump this package and publish **before** dependent releases.

## Related packages

| Package | Repo |
|---------|------|
| `@quantumaudio/ableton-mcp` | [qa-ableton-mcp](https://github.com/QaAudio/qa-ableton-mcp) |
| `@quantumaudio/ableton-mcp-kernel` | [qa-ableton-mcp](https://github.com/QaAudio/qa-ableton-mcp) |
| `@quantumaudio/music-ir` | [qa-music-ir](https://github.com/QaAudio/qa-music-ir) |

## Contributing

See [AGENTS.md](AGENTS.md). Breaking wire-format changes require coordinated releases across kernel + server + this package.
