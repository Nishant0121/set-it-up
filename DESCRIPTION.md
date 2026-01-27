# @nishant0121/set-it-up: The Ultimate Project Scaffolding CLI

## Overview

**Set It Up** is a powerful, developer-centric CLI tool engineered to eliminate the repetitive boilerplate work associated with starting new React and React Native projects. It bridges the gap between "Hello World" and a production-ready architecture.

Unlike standard create scripts that give you a bare-bones entry point, `set-it-up` (via its command `forge`) constructs a robust, scalable foundation tailored to your preferences (TypeScript/JavaScript, Styling, Routing, etc.).

## Why Use This?

Starting a modern frontend project often involves 30-60 minutes of configuration:
- Setting up tailwind.
- configuring the router.
- creating folder structures (`pages`, `components`, `context`).
- installing navigation libraries for mobile.
- handling safe area contexts.

**Set It Up** does this in seconds.

## Key Capabilities

### 1. Interactive "Forge" Wizard
The `forge` command launches an intuitive,inquirer-based terminal wizard that asks you exactly what you need. No complex flags to remember—just answer the questions, and the CLI handles the rest.

### 2. React (Web) Excellence
- **Vite-Powered:** Uses the fastest build tool in the ecosystem.
- **Tailwind CSS v4:** Automatically configured with the latest version using the Vite plugin.
- **Shadcn UI Integration:** The only CLI that can set up Shadcn UI and automatically transpile its TypeScript components to JavaScript if you prefer a JS-only project.
- **Auto-configured Path Aliases:** Pre-sets `@/` aliases in Vite and TS/JS configs for cleaner imports.
- **Structure:** Automatically creates `src/pages`, `src/components`, and `src/layouts`.
- **Router Ready:** Installs `react-router-dom` and sets up a default routing configuration with a Layout and Navbar.
- **State & Theme:** Optional `AppContext` boilerplating for global state and dark-mode ready theme management.

### 3. React Native (Mobile) Mastery
- **Modular Architecture:** Moves away from the monolithic `App.tsx` pattern. It generates a clean separation of concerns:
  - `src/pages/` (Screens)
  - `src/components/` (Reusable UI)
- **Navigation Pre-baked:** Installs and configures React Navigation (Native Stack).
- **Auto-configured Path Aliases:** Ready-to-use path resolution for cleaner codebase management.
- **Safe Area Handling:** Implements `react-native-safe-area-context` with `SafeAreaProvider` wrapping the app and `SafeAreaView` in screens.
- **Polished Templates:** The generated starter screens (`HomeScreen`, `DetailsScreen`) are not blank white pages. They feature modern design, cards, shadows, and proper typography, giving you a beautiful starting point.

### 4. Smart & Safe
- **Prerequisite Checking:** Scans your environment for Node.js, Git, and other tools before starting to prevent mid-install failures.
- **Package Manager Agnostic:** Works seamlessly with `npm`, `yarn`, and `pnpm`.
- **Lightning Fast Conversion:** Uses `esbuild` for instant TypeScript to JavaScript transpilation when bridging Shadcn UI into JS projects.

## Technology Stack

- **CLI Engine:** Node.js, Commander, Inquirer, Ora (spinners), Chalk (styling), Boxen, Gradient-String.
- **Automation:** Execa (process execution), FS-Extra (file system), Esbuild (fast transpilation).
- **Templates:** React (Vite), React Native (CLI), Tailwind CSS v4, React Navigation, React Router DOM.

## Roadmap (Coming Soon)
- **Next.js Support:** Full App Router scaffolding with advanced features.
- **Custom GitHub Templates:** Forge projects from your own private or public repositories.
- **Backend Forging:** Express.js and FastAPI starter templates.

## Get Started

```bash
npm install -g @nishant0121/set-it-up
forge
```
