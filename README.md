# StadiumIQ - Physical Event Experience 🏟️

Welcome to **StadiumIQ**, the core platform for the **Physical Event Experience** project! This repository contains the unified solution to significantly improve the real-world experience for attendees at large-scale sporting venues through smart operations and interactive apps.

## 🎯 The Objective

The core objective of this project is to build a unified system that tackles common bottlenecks and pain points attendees face during physical events. Our end goal is to ensure a seamless, engaging, and highly enjoyable experience from the moment fans arrive at the venue until they leave.

## ✨ Proposed Features

* **Smart Wayfinding & Heatmaps:** Real-time crowd density tracking to route attendees through the fastest paths.
* **Virtual Queues & Pre-ordering:** An integrated system to order food or merchandise from seats and pick it up via an express lane.
* **Live Event Notifications:** Instant push alerts for gate changes, event schedules, and critical broadcasts.
* **Interactive Venue Map:** A dynamic, mobile-friendly map of the sporting venue with live points of interest. 
* **Operator Command Dashboard:** Live ops tools to route stewards and resolve congestion.

## 🏗️ Monorepo Architecture

We've structured this project as a high-performance **Turborepo** monorepo to ensure seamless code sharing and rapid local development. 

### Apps and Packages
- `apps/web`: Next.js App Router (Tailwind) — The primary Progressive Web App (PWA) for attendee access.
- `apps/operator`: Next.js App Router (Tailwind) — The mission-control dashboard for venue operators.
- `apps/mobile`: React Native (Expo) — The fully-featured native iOS & Android application.
- `services/api`: Node.js Backend — The central API cluster managing ticketing, wayfinding logic, and database operations.

### Technology Stack
- **Frontend / Operator Admin**: React, Next.js 15, Tailwind CSS
- **Mobile**: React Native, Expo
- **Backend Infrastructure**: Node.js, Prisma ORM, SQLite (Zero-Dependency Local Dev)
- **Tooling**: Turborepo, ESLint, TypeScript

## 🚀 Getting Started

To spin up the entire StadiumIQ ecosystem (Web app, Operator app, Mobile interface, and the backend) on your local machine, follow these steps:

### Prerequisites
Make sure you have Node.js (v20+) and npm installed. Thanks to our zero-dependency SQLite pivot, you **do not** need Docker!

### 1. Install Dependencies
Switch into the project root and install all monorepo dependencies in one go:
```bash
npm install
```

### 2. Generate the Database
Navigate to the central API service to sync the Prisma SQLite schema:
```bash
cd services/api
npm run db:setup # Or run: npx prisma db push
cd ../..
```

### 3. Spin Up the Platform
Fire up the Turborepo development server. This will concurrently launch the PWA, Operator Dashboard, Expo mobile bundler, and Backend API:
```bash
npm run dev
```

---
*Built to redefine the modern fan experience.*
