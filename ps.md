# Product Specification // Athex.Doc (PS-01)

Athex.Doc is a high-efficiency, multi-format AI Document Analyst platform engineered for students, technical professionals, and developers. Bypassing conversational fluff, the application allows operators to load complex documentation, slides, and code assets to extract strict, deterministic insight streams via an automated Gemini pipeline.

---

## 🎯 Target Audience & Value Proposition

- **Academic / Students:** Accelerates the ingestion of dense textbooks, research papers, and technical syllabus sheets during high-intensity, late-night study blocks.
- **Engineering Professionals:** Minimizes time spent digging through massive API reference specifications, software architecture diagrams, and system manuals.
- **Core Value:** Provides zero-latency summaries, precise natural language structural queries, and high-fidelity insights over multi-format data vectors.

---

## 🎛️ Functional Requirements (Core Capabilities)

### 1. Multi-Format File Ingestion

- **Specification:** The application must accept raw file uploads via a drag-and-drop landing zone interface.
- **Supported Formats:** Portable Document Format (`.pdf`), Word Assets (`.docx`), and PowerPoint Presentations (`.pptx`).
- **Technical Pipeline:** Handled within `src/features/upload/` and resolved via `src/hooks/use-document.ts`, compiling the target document binary directly into a Base64 string chunk matrix.

### 2. Natural Language Query Console

- **Specification:** Operators can issue contextual prompts against the active ingested asset using standard engineering vocabulary.
- **Visual Interface:** Built as a strict, high-contrast text terminal entry row featuring a crisp monospaced font framework and an instantaneous layout response.

### 3. High-Fidelity Extraction & Analysis

- **Specification:** The application must stream accurate answers, bulleted core summaries, and critical structural insights.
- **Deterministic Guards:** Forced execution at `temperature: 0.2` within the backend infrastructure layer (`src/services/gemini/client.ts`) to prevent AI hallucinations, ensuring answers are strictly grounded in the parsed document text.

---

## 📐 System Inversion Matrix (Feature to Code Map)

| Product Capability            | Frontend Representation Layer                     | Business Engine Domain                                              | Backend Infrastructure Service                                   |
| :---------------------------- | :------------------------------------------------ | :------------------------------------------------------------------ | :--------------------------------------------------------------- |
| **Document Upload**           | `src/features/upload/components/file-drop.tsx`    | `src/features/upload/hooks/`                                        | `src/hooks/use-document.ts` (Base64 matrix processing)           |
| **Natural Language Queries**  | `src/features/chat/components/chat-box.tsx`       | `src/features/chat/store/use-chat-store.ts` (Zustand state updates) | `src/app/api/analyze/route.ts` (Secure Edge execution framework) |
| **Insight Extraction Engine** | `src/features/chat/components/message-bubble.tsx` | Real-time byte buffer chunk reader streams                          | `src/services/gemini/` (Google Gen AI SDK & system prompts)      |

---

_Athex.Doc Product Specification Framework // Version 1.0.0 // Confidential Project Manifest._
