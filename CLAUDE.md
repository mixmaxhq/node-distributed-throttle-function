# node-distributed-throttle-function — repo card

> A map, not a manual. Keep it ~1 screen; point to detail, don't inline it.

## What it is

A tiny library exporting a distributed `throttle()` function (like Underscore's) that coordinates across processes via Redis. You inject a redis client; it returns a throttle bound to that connection. Dormant: published to npm (v0.0.3) but no Mixmax repo currently depends on it.

## serves

role: distributed throttle — rate-limits a named function to at most one leading + trailing call per TTL window, coordinated across a distributed system through Redis.
referenced-by: []

## Code map

- Public factory + API (`throttle`, `.call`, `.cancel`) -> index.js
- Redis-side claim logic (atomic `SET NX PX` + `PTTL`) -> lua/claimThrottleLock.lua
- Usage example -> README.md

## Conventions

- Package manager: npm (`package-lock.json`, lockfileVersion 1).
- Test framework: none — `test` script is a placeholder that exits 1.
- Build: none — plain CommonJS, `main` is index.js.
- CI: none — no `.github/workflows/`, no Jenkinsfile; `npm run ci` just runs `eslint .` (config `eslint-config-mixmax`, `mixmax/node`).
- Publish: manual `npm publish` — no automated release workflow.
- Runtime dep: `node-redis-scripty` (loads/runs the Lua script). Redis connection is injected by the caller.

## Run / test

- Install: `npm install`
- Lint / CI: `npm run lint` (or `npm run ci`)
- No tests to run.

## Load the matching domain card

- Cross-cutting library — load the consuming capability's card, not a domain-* for this repo.
