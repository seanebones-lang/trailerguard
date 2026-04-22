# TrailerGuard

TrailerGuard is a premium mobile platform for trailer and fleet operations with immutable mileage tracking, BLE tire pressure monitoring, realtime status, and alerting.

## Workspace Layout

- `apps/mobile` - Expo React Native app
- `packages/shared` - shared domain types
- `supabase` - SQL migrations and policy foundations

## Quick Start

1. Install dependencies from repo root:
   - `npm install`
2. Copy env template:
   - `cp apps/mobile/.env.example apps/mobile/.env`
3. Add Supabase credentials to `apps/mobile/.env`.
4. Start mobile app:
   - `npm run mobile:start`

## Current Foundations Implemented

- Auth-ready navigation (Sign In + app tabs)
- Supabase client with persisted session
- Dashboard / Trailers / Settings scaffolding
- BLE service skeleton for gateway discovery
- GPS mileage utilities with accuracy filtering
- Initial append-only mileage migration
