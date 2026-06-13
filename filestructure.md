# Athex.Doc // Production Workspace Architecture

This document maps out the production-grade, feature-driven directory architecture for `athex-doc`. The repository is engineered using a decoupled, service-isolated Next.js App Router structure optimized for brutalist/industrial design systems (0px borders), atomic component rendering, and high-performance real-time Gemini API text streaming.

---

## 🛠️ The Repository Blueprint

```text
athex-doc/
├── .env.example                      # Template for public distribution keys
├── .env.local                        # Local runtime secrets (GEMINI_API_KEY, etc.)
├── next.config.mjs                   # Next.js optimization configuration
├── tailwind.config.ts                # Industrial/Brutalist custom design tokens
├── tsconfig.json                     # System TypeScript compiler properties
├── package.json                      # Build scripts and project dependencies
├── postcss.config.mjs                # PostCSS styles processor engine configuration
│
├── public/                           # Static, public immutable assets
│   ├── fonts/                        # Local technical/monospaced typeface binaries
│   └── vectors/                      # High-fidelity SVG system icons
│
└── src/
    ├── app/                          # NEXT.JS ROUTING & GATEWAY LAYER
    │   ├── layout.tsx                # Root layout (Global contexts, typography)
    │   ├── page.tsx                  # Marketing landing page & workspace CTA entry
    │   │
    │   ├── workspace/                # MAIN INTERACTIVE DASHBOARD ROUTE
    │   │   ├── page.tsx              # Main dashboard view panel assembly orchestrator
    │   │   ├── loading.tsx           # Neo-bento custom skeleton fallback frames
    │   │   └── error.tsx             # Fault-isolation bounding block for the dashboard
    │   │
    │   └── api/                      # INTERNAL SERVER GATEWAY LAYERS
    │       └── analyze/
    │           └── route.ts          # Edge/Node.js chunk-streaming API for Gemini
    │
    ├── components/                   # STRUCTURAL PRESENTATION UI (Dumb/Pure Components)
    │   ├── ui/                       # Atomic presentation primitives (0px radius design)
    │   │   ├── button.tsx            # Industrial functional interactive button elements
    │   │   ├── card.tsx              # Bento-grid raw container segments
    │   │   ├── input.tsx             # Monospaced minimalist textual entry slots
    │   │   └── scroll-area.tsx       # Custom layout layout overflow track scrollbars
    │   │
    │   └── layout/                   # Core application layout wrappers
    │       ├── navbar.tsx            # Minimal global workspace structural banner
    │       └── sidebar.tsx           # Transient document context history tray layout
    │
    ├── features/                     # SEGREGATED DOMAIN BUSINESS LOGIC (Smart Modules)
    │   ├── chat/                     # Conversational operations sub-module
    │   │   ├── components/           # UI pieces localized strictly to chat contexts
    │   │   │   ├── chat-box.tsx
    │   │   │   └── message-bubble.tsx
    │   │   └── store/
    │   │       └── use-chat-store.ts # Centralized conversation state machine (Zustand)
    │   │
    │   └── upload/                   # Ingestion processing asset sub-module
    │       ├── components/
    │       │   ├── file-drop.tsx     # Custom binary landing zone element
    │       │   └── processing-overlay.tsx
    │       └── hooks/
    │           └── use-file-processor.ts # Validations and binary ingestion piping hooks
    │
    ├── services/                     # BACKEND INFRASTRUCTURE ADAPTERS (Third-Party Providers)
    │   ├── gemini/                   # Isolated Artificial Intelligence SDK Service
    │   │   ├── client.ts             # Initialized Google Gen AI SDK integration instance
    │   │   ├── system-prompts.ts     # Decoupled strict technical agent engine personas
    │   │   └── stream-helpers.ts     # Data transformation and pipeline buffer algorithms
    │   │
    │   └── storage/                  # Client/Server state preservation persistence layer
    │       └── index.ts              # IndexedDB interface drivers for browser cache memory
    │
    ├── hooks/                        # CONTEXT-AGNOSTIC REUSABLE REACT HOOKS
    │   ├── use-document.ts           # Document stream handling (PDF to Base64 data compilation)
    │   └── use-toast.ts              # Transient workflow error alerts event notifications
    │
    ├── utils/                        # CONTEXT-FREE COMPUTATIONAL FUNCTION PACKAGES
    │   ├── cn.ts                     # Classname merging tool (clsx + tailwind-merge configuration)
    │   └── file.ts                   # Structural byte string transformations and type checks
    │
    ├── types/                        # ZERO-FOOTPRINT GLOBAL TYPESCRIPT STRUCTS
    │   ├── index.d.ts
    │   ├── chat.types.ts             # Contract bindings matching architectural conversation items
    │   └── api.types.ts              # Gemini request structures and token response maps
    │
    └── styles/                       # TAILWIND LAYER OVERRIDES & DEEP ARCHITECTURAL STYLING
        └── globals.css               # Brutalist design guidelines and scroll track metrics
```
