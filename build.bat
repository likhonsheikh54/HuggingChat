@echo off
rmdir /s /q node_modules
del package-lock.json
bun install
bun run build
