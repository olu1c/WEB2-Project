# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

A travel planning web application where users can organize all trip information in one place: basic trip data, destinations, daily activity schedule, expenses/budget, notes, checklist, and sharing with others via QR code.

## Architecture Overview

Built on **Azure Service Fabric** with microservices and a React frontend. The requirement specifies **at least 3 microservices** using both stateless and stateful services, with SQL Server for persistence.

### Current services

- **UserService** (`/UserService`) — Stateless ASP.NET Core. Handles registration, login, JWT issuance. Persists users in SQL Server via EF Core. Port **8796**.
- **TripService** (`/TripService`) — Stateful ASP.NET Core. Manages trips using Service Fabric **Reliable Collections** (`IReliableDictionary`) — no SQL database, state lives in SF replica. Port **8082**.
- **ProjekatWEB2** (`/ProjekatWEB2`) — Service Fabric application project (`.sfproj`) with `ApplicationManifest.xml`.
- **Frontend** (`/frontend`) — React 19 + Vite + React Router v7.

### Key architectural facts

- Services are not behind a gateway — frontend calls each service directly by port.
- JWT issued by UserService, validated by TripService. Both share the same `Jwt:Key` from `appsettings.json`.
- **Known claim mismatch**: UserService issues a plain `"userId"` claim but TripService reads `ClaimTypes.NameIdentifier`. Fix this before adding more auth-dependent features.
- TripService Reliable Collections: all reads/writes must be wrapped in `_stateManager.CreateTransaction()`.
- Frontend auth: JWT stored in `localStorage` under key `"token"`. Helpers in `src/util/auth.jsx`. `ProtectedRoute` redirects to `/login` if token invalid/expired.
- React Router v7 used with `createBrowserRouter`. Form submission actions are colocated in page files.

## Domain Model (Required Entities)

The central entity is **Trip** (plan putovanja). Each trip contains:
- **Destination** — name, location, arrival date, departure date, description/notes
- **Activity** — name, date, time, location, description, estimated cost, status (planned/reserved/completed/cancelled)
- **Expense** — name, category (transport/accommodation/food/tickets/shopping/other), amount, date, description
- **Checklist item** — text, completed flag (packing list / pre-trip obligations)

Two user roles: **User** (manages own trips) and **Admin** (can view/manage all users and content).

## Mandatory Requirements (from project spec)

- At least 3 Service Fabric microservices (stateless + stateful)
- SQL migrations must exist
- Passwords hashed in DB
- JWT signature and expiry must be validated
- Date validation: end date cannot be before start date; budget cannot be negative
- Deleting a trip must cascade-delete all related entities (destinations, activities, expenses, checklist)
- Frontend URLs (backend API base URLs) must be in `.env` file, not hardcoded
- HTTP calls from frontend must be in injected services, never directly in components
- Frontend must have models
- Backend must have separate DTO and DB models with mapping between them
- REST naming conventions: https://restfulapi.net/resource-naming
- Trip sharing via QR code with VIEW and EDIT access levels; backend validates token type per request
- Calendar view for activities grouped by date
- Budget tracking: auto-calculate total expenses and remaining budget
- PDF report generation (optional/bonus)
- Components must be split properly on the frontend

## Commands

### Frontend (`/frontend`)
```bash
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

### Backend
```bash
dotnet build UserService/UserService.csproj
dotnet build TripService/TripService.csproj
```
Run via Visual Studio (F5) to deploy to the local Service Fabric cluster. Swagger in Development mode:
- UserService: `http://localhost:8796/swagger`
- TripService: `http://localhost:8082/swagger`

### EF Core migrations (UserService)
Run from the `UserService` directory:
```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```
Connection targets `localhost\SQLEXPRESS`, database `PutovanjeDB`, user `appuser`.
