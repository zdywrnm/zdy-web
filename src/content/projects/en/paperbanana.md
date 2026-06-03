---
title: PaperBanana
description: An AI-powered academic illustration generator
order: 1
tech:
  - React
  - TypeScript
  - Electron
  - Better Auth
  - Laf
  - Sealos
  - pnpm monorepo
repo: https://github.com/zdywrnm/PaperBanana-clients
demo: https://paperbanana.asia
cover: /projects/paperbanana.png
role: Core Developer
period: 2026.03 - present
location: Ningbo
status: In progress
nodes:
  - web
  - desktop
  - mobile
  - api
featured: true
---

PaperBanana is an AI illustration generator for academic work, aiming to get the figures in papers, reports and course slides usable faster.

I lead the core development — Codex as the primary implementer, Claude assisting with architecture decisions — turning a research-illustration idea into a deliverable multi-platform system.

## Scope of delivery

- Shipped five clients from a single codebase: Web, macOS, Windows, Android and a WeChat mini-program.
- Organized the monorepo with pnpm workspaces, sharing API calls, type contracts and product logic across packages.
- Rewrote the upstream Python prototype into a zero-dependency TypeScript CLI published to npm, collapsing "set up a Python environment + multi-step install" into a single command.
- Deployed a Better Auth gateway and Laf cloud functions on Sealos for cross-platform account, task and generation-history sync.

## Current progress

The production site `paperbanana.asia` is live. Next up: more real research-scenario templates, a better editing flow for generated results, and a technical write-up spanning model adaptation to multi-platform release.
