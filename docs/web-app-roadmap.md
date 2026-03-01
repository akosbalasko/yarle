# Web App Roadmap (Issue #470)

This document captures a pragmatic path to offer YARLE as a browser-hosted app,
while keeping conversion logic in this repository.

## Goals

- Run conversion fully in-browser (no server upload of notes)
- Allow users to pick ENEX files and output folder from the browser
- Keep feature parity with the existing desktop flow where feasible

## Phase 1 — Browser compatibility baseline

1. Extract conversion entry point that accepts raw ENEX XML strings and returns generated markdown/resources in memory.
2. Keep Node-specific filesystem code (`dropTheRopeRunner`) as a thin wrapper around the shared converter.
3. Add tests around the shared converter API.

## Phase 2 — Experimental web UI

1. Add a `web/` app (Vite + TypeScript) that imports the shared converter package.
2. Use the File System Access API for:
   - selecting ENEX files,
   - selecting output folder,
   - writing generated markdown/resources.
3. Provide graceful fallback for browsers without File System Access API:
   - offer ZIP download.

## Phase 3 — Publish

1. Deploy static build to GitHub Pages (or Netlify).
2. Add clear privacy note: conversion runs locally in browser; no file upload.
3. Mark as **experimental** and collect feedback before promoting as default.

## Known risks

- Some conversion utilities may rely on Node APIs and require adaptation.
- Browser memory constraints for very large ENEX exports.
- Resource extraction and binary handling needs careful compatibility testing.

## Why this approach

This keeps YARLE's core conversion logic shared between desktop and web,
minimizes regression risk, and allows incremental delivery.
