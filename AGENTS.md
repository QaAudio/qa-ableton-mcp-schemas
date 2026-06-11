# qa-ableton-mcp-schemas — Agent Guide

Package: `@quantumaudio/ableton-mcp-schemas`. Shared Zod wire schemas for qa-ableton-mcp.

## Layout

```
qa-ableton-mcp-schemas/
├── src/
│   ├── address.ts    # Address union + parsers
│   ├── outputs.ts    # perception output Zod schemas + getters
│   └── index.ts
├── dist/             # tsc emit
└── package.json
```

## Commands

```bash
npm run typecheck
npm run build
```

## Conventions

- TypeScript under `src/` only; NodeNext + `.js` import suffixes.
- Schemas are the **contract** between [qa-ableton-mcp](https://github.com/QaAudio/qa-ableton-mcp) kernel and server — treat changes as API releases.
- `get*OutputSchema(responseFormat)` helpers must stay aligned with kernel `serialize/` modules.

## Coordinated change workflow

1. Edit schema here → `npm run build`
2. Bump version; publish or link in monorepo
3. Update kernel serializers + MCP `output-schemas` tests in qa-ableton-mcp
4. Run `npm run ableton-mcp:test:unit` and live gate if available

Security / publish: `.cursor/skills/security-guidelines/SKILL.md`.
