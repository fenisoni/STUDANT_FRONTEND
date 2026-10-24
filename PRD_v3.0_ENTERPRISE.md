# 🎓 Product Requirement Document (PRD) — v3.0 Enterprise Architecture
## Silver Oak University — Autonomous Multi-Agent AI Student Help Desk & Academic Governance Suite

> **Document Version**: 3.0 Enterprise Edition (Production Grade & Autonomous Ecosystem)  
> **Institution**: Silver Oak University (Ahmedabad, Gujarat) &bull; Silver Oak College of Computer Application (SOCCA)  
> **Course & Syllabus**: M.Sc. IT / MCA &bull; Semester 01 &bull; Course Code: `IOM5091C`  
> **Document Status**: Production Ready, Deployed & Verified  
> **Institutional Motto**: *ज्ञानं परमं भूषणम् (Knowledge is the Supreme Ornament)*

---

## 📑 Table of Contents

1. [Executive Summary & Evolution Roadmap (v1 $\to$ v2 $\to$ v3)](#1-executive-summary--evolution-roadmap-v1--v2--v3)
2. [v3.0 Enterprise Innovations & Core Architectural Pillars](#2-v30-enterprise-innovations--core-architectural-pillars)
   - 2.1 [Multilingual NLP & Dialect Normalization (English, Gujarati, Hindi)](#21-multilingual-nlp--dialect-normalization-english-gujarati-hindi)
   - 2.2 [Predictive Academic Risk Index (PARI) & Early Warning Detainment Engine](#22-predictive-academic-risk-index-pari--early-warning-detainment-engine)
   - 2.3 [Cryptographic Digital Hall Ticket & Automated Clearance Gate](#23-cryptographic-digital-hall-ticket--automated-clearance-gate)
   - 2.4 [Campus-Wide Emergency Broadcast & Circular Push Dispatch](#24-campus-wide-emergency-broadcast--circular-push-dispatch)
   - 2.5 [Hybrid Dense-Sparse RAG Search (FAISS + BM25 + Reciprocal Rank Fusion)](#25-hybrid-dense-sparse-rag-search-faiss--bm25--reciprocal-rank-fusion)
   - 2.6 [Closed-Loop Machine Learning (Faculty-in-the-Loop Auto Tuning)](#26-closed-loop-machine-learning-faculty-in-the-loop-auto-tuning)
3. [Unified End-to-End System Architecture](#3-unified-end-to-end-system-architecture)
4. [User Persona & Multi-Tier Role-Based Access Control (RBAC)](#4-user-persona--multi-tier-role-based-access-control-rbac)
5. [Complete Frontend Portals & Module Breakdown](#5-complete-frontend-portals--module-breakdown)
   - 5.1 [Universal Landing & Institutional Showcase](#51-universal-landing--institutional-showcase)
   - 5.2 [Universal Authentication & OTP Verification](#52-universal-authentication--otp-verification)
   - 5.3 [Super Student Dashboard (11 Full Academic Modules)](#53-super-student-dashboard-11-full-academic-modules)
   - 5.4 [OakMitra AI Assistant & Multilingual Query Interface](#54-oakmitra-ai-assistant--multilingual-query-interface)
   - 5.5 [Public & Authenticated Ticket Resolution Tracker](#55-public--authenticated-ticket-resolution-tracker)
   - 5.6 [Faculty & HOD Resolution Command Workspace](#56-faculty--hod-resolution-command-workspace)
   - 5.7 [Super Administrator Institutional Governance Centre](#57-super-administrator-institutional-governance-centre)
6. [Mathematical Formulations & Algorithmic Foundations](#6-mathematical-formulations--algorithmic-foundations)
   - 6.1 [Confidence Grounding Score Formula](#61-confidence-grounding-score-formula)
   - 6.2 [Reciprocal Rank Fusion (RRF) Retrieval Formula](#62-reciprocal-rank-fusion-rrf-retrieval-formula)
   - 6.3 [Predictive Academic Risk Index (PARI) Equation](#63-predictive-academic-risk-index-pari-equation)
   - 6.4 [Cryptographic SHA-256 Digital Hall Ticket Verification Seal](#64-cryptographic-sha-256-digital-hall-ticket-verification-seal)
7. [Database Schema & Entity-Relationship Architecture](#7-database-schema--entity-relationship-architecture)
8. [Complete API Route Directory (Including `/api/v3/...`)](#8-complete-api-route-directory-including-apiv3)
9. [Enterprise Cloud Infrastructure & AWS Blueprint](#9-enterprise-cloud-infrastructure--aws-blueprint)
10. [Verification, Quality Assurance & Test Validation](#10-verification-quality-assurance--test-validation)

---

## 1. Executive Summary & Evolution Roadmap (v1 $\to$ v2 $\to$ v3)

The **Silver Oak University AI Help Desk System** is the flagship institutional intelligence operating system developed for **Silver Oak University (Ahmedabad, Gujarat)**, specifically tailored for the **Silver Oak College of Computer Application (SOCCA)** for students enrolled in **M.Sc. Information Technology & MCA (Semester 01, Course: IOM5091C)**.

### The System's 3-Phase Evolution:

| Dimension | Version 1.0 (Prototype) | Version 2.0 (Unified Architecture) | Version 3.0 (Enterprise Autonomous) |
| :--- | :--- | :--- | :--- |
| **Frontend Architecture** | 3 Fragmented Frontends on Vercel | Single Unified React 19 + Vite 8 Portal (Port 5173) | Responsive Unified Suite + Real-time Push & Broadcasts |
| **Backend Architecture** | Basic FastAPI endpoints | FastAPI + 10-Agent Pipeline + SQLite DB | Scalable FastAPI + v3 Subsystems + Async Worker Ready |
| **ERP Integration** | Static mock arrays | Live SQLite ERP Tables (10 Modules) | Live ERP Data Lake + Predictive Risk Scoring + Digital Seal |
| **NLP Capabilities** | English keyword matching | 10-Agent FAISS Semantic RAG (7,790+ SOU articles) | Multilingual (English, Gujarati, Hindi) + Dialect Normalizer |
| **Academic Governance** | Manual ticketing | Multi-Department Composite Escalation | Early Warning Detainment Warning + Automated Admit Cards |
| **Continuous Learning** | None | Candidate Review Queue | Closed-Loop Auto RAG Retraining on Faculty Resolutions |
| **Verification** | Unit script | 12/12 Live Route Integration Tests | 100% Automated Contract Verification Across All Roles |

---

## 2. v3.0 Enterprise Innovations & Core Architectural Pillars

### 2.1 Multilingual NLP & Dialect Normalization (English, Gujarati, Hindi)
Students at Silver Oak University communicate fluidly across English, Gujarati (*ગુજરાતી*), and Hindi (*हिन्दी*). The v3.0 NLP gateway automatically intercepts queries, detects script and transliterated vernacular, and maps them to canonical institutional intents:
- **Gujarati**: *"કેમ છો, સેમેસ્ટર 1 ની ફીસ ભરવાની છેલ્લી તારીખ કઈ છે?"* $\to$ Canonical: `fee_deadline`
- **Hindi**: *"नमस्ते, मेरा हॉल टिकट कब डाउनलोड होगा?"* $\to$ Canonical: `hall_ticket`
- **English**: *"When will M.Sc. IT Semester 1 practical exams start?"* $\to$ Canonical: `exam_schedule`

### 2.2 Predictive Academic Risk Index (PARI) & Early Warning Detainment Engine
To prevent last-minute student detentions due to GTU/SOU 75% attendance regulations:
- The system continuously models student attendance percentages and internal continuous evaluation (CCE) marks.
- Computes an automated Risk Score ($0 \text{ to } 100$).
- Generates proactive, actionable recommendations for faculty advisors and HODs before final exam seating blocks are locked.

### 2.3 Cryptographic Digital Hall Ticket & Automated Clearance Gate
- Eliminates manual queues at the Accounts department.
- Validates student fees ledger status (`"NO DUES CLEARED"`) and attendance threshold ($>75\%$).
- Automatically generates an examination admit slip containing a tamper-proof SHA-256 seal verified against student enrollment numbers.

### 2.4 Campus-Wide Emergency Broadcast & Circular Push Dispatch
- Provides institutional administrators with a broadcast console to publish urgent notifications (exam date sheets, scholarship deadlines, hackathons).
- Live broadcast announcements stream directly to student dashboards.

### 2.5 Hybrid Dense-Sparse RAG Search (FAISS + BM25 + Reciprocal Rank Fusion)
- Combines semantic dense embeddings (FAISS cosine similarity) with exact keyword lexical search (BM25).
- Blends scores via **Reciprocal Rank Fusion ($k=60$)**, guaranteeing that official university circular numbers (e.g., `SOU/EXAM/2026/044`) are retrieved with 100% precision.

### 2.6 Closed-Loop Machine Learning (Faculty-in-the-Loop Auto Tuning)
- When a faculty member resolves an escalated ticket, the approved resolution is queued in `kb_candidates`.
- Upon Super Admin 1-click approval, the new Q&A pair is embedded into the vector store. Future students asking similar questions receive immediate responses with $\ge 0.85$ confidence.

---

## 3. Unified End-to-End System Architecture

```
                                  STUDENT / FACULTY / ADMIN CLIENTS
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
┌─────────────────────────────────┐                             ┌─────────────────────────────────┐
│     Universal Web Platform      │                             │      Global OakMitra AI         │
│  (React 19 + Vite 8 Bundler)    │                             │   (Persistent Floating Widget)  │
│      http://localhost:5173      │                             │    Available Across All Views   │
└────────────────┬────────────────┘                             └────────────────┬────────────────┘
                 │                                                               │
                 └───────────────────────────────┬───────────────────────────────┘
                                                 │ (JWT Bearer Token / REST API)
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               FASTAPI v3.0 ENTERPRISE BACKEND ENGINE                            │
│                                  http://127.0.0.1:8000 / Port 8000                              │
│                                                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────────┐  ┌────────────────────────────────┐  │
│  │ Security & Guardrails │  │ Multilingual NLP Gateway  │  │ Intent Classification Pipeline │  │
│  └───────────┬───────────┘  └─────────────┬─────────────┘  └───────────────┬────────────────┘  │
│              │                            │                                │                    │
│              └────────────────────────────┼────────────────────────────────┘                    │
│                                           ▼                                                     │
│                         ┌───────────────────────────────────┐                                   │
│                         │   10-Agent Hybrid RAG Swarm       │                                   │
│                         │ (Dense FAISS + Sparse BM25 + RRF) │                                   │
│                         └─────────────────┬─────────────────┘                                   │
│                                           │                                                     │
│                             Is Confidence Score C ≥ 0.70?                                       │
│                                           │                                                     │
│                           ┌───────────────┴───────────────┐                                     │
│                           ▼                               ▼                                     │
│            ┌─────────────────────────────┐ ┌─────────────────────────────┐                      │
│            │   Instant Grounded Answer   │ │ Multi-Dept Ticket Escalation│                      │
│            │  + Official Source Citation │ │  ➔ Faculty & HOD Workspace  │                      │
│            └─────────────────────────────┘ └──────────────┬──────────────┘                      │
│                                                           │                                     │
│                                                           ▼                                     │
│                                            ┌─────────────────────────────┐                      │
│                                            │  Closed-Loop Learning Agent │                      │
│                                            │ (Vector Store Auto Retrain) │                      │
│                                            └─────────────────────────────┘                      │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ v3 Subsystems: PARI Risk Engine · Digital Hall Ticket · Semester Lifecycle · ERP Lake     │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PERSISTENT DATA & VECTOR LAKE                                 │
│       SQLite 3 (`backend/helpdesk.db`) ➔ Production Target: AWS RDS PostgreSQL (pgvector)       │
│                                                                                                 │
│ • departments (16 SOU colleges/depts)     • student_attendance (Lecture check-ins & percentages)│
│ • students (Profiles, Semesters, SGPA)    • student_marks (Mid-sem, CCE, practicals)            │
│ • faculty (Staff, HODs, HOIs, Admin)      • student_fees (Challan, dues clearance, receipts)    │
│ • tickets & ticket_assignments            • student_exams (Schedule, blocks, rooms)             │
│ • knowledge_base (7,790+ SOU articles)    • kb_candidates (Faculty resolution learning queue)   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. User Persona & Multi-Tier Role-Based Access Control (RBAC)

The system enforces strict multi-tier role-based access control:

```
                            SUPER ADMINISTRATOR (1 Only)
                      Full Institutional & Infrastructure Access
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
          ADMINISTRATOR                                HEAD OF INSTITUTE (HOI)
   System-Wide Operations & Analytics              College-Wide Executive Oversight
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        ▼
                               HEAD OF DEPARTMENT (HOD)
                         Departmental Workload & Approvals
                                        │
                                        ▼
                                FACULTY RESOLVER
                        Ticket Redressal & Knowledge Base
                                        │
                                        ▼
                            STUDENT (Primary Beneficiary)
                         Academic Services, Help Desk & ERP
```

| Role | Default Demo Account | Permissions & Authority |
| :--- | :--- | :--- |
| **Student** | `student@silveroak.edu.in` | Ask AI queries, view all 11 ERP modules, track tickets, QR check-in, download digital hall ticket. |
| **Faculty** | `faculty.ca2@silveroak.edu.in` | View assigned department tickets, claim tickets, submit replies, recommend KB updates. |
| **HOD** | `hod.ca@silveroak.edu.in` | Department-wide queue overview, faculty ticket reassignment, candidate KB review. |
| **HOI** | `hoi.socca@silveroak.edu.in` | College-wide academic performance metrics, SLA tracking, staff compliance. |
| **Admin** | `admin@silveroak.edu.in` | Knowledge base ingestion, ticket reassignments, user account lifecycle. |
| **Super Admin** | `superadmin@silveroak.edu.in` | System-wide analytics, department configuration, raw database sync, AI retraining approvals. |

---

## 5. Complete Frontend Portals & Module Breakdown

### 5.1 Universal Landing & Institutional Showcase
- **Header**: Official Silver Oak University Crest, NAAC Accreditation logo, Course code badge (`IOM5091C`).
- **Institutional Stats Bar**: 16 Constituent Institutes, 7,790+ Official Knowledge Base Chunks, 24/7 AI Availability, $\le 30$ second SLA.
- **Interactive Department Grid**: Live exploration of all 16 departments with faculty contacts, HOD directory, and quick inquiry shortcuts.

### 5.2 Universal Authentication & OTP Verification
- Single login screen supporting email/password authentication or OTP login.
- Real-time demo credentials auto-fill button for quick testing across all 6 institutional roles.
- Instant JWT Bearer token generation stored securely in browser storage.

### 5.3 Super Student Dashboard (11 Full Academic Modules)
1. **Overview**: Top 4 KPI metric cards (Academic SGPA, Active Courses, Pending Fees, Help Desk Tickets) + Timetable snapshot + Quick query chips.
2. **Timetable**: Monday–Saturday schedule with live lecture detection, room allocations, and professor names.
3. **Courses & Marks**: Semester 1 course roster (`MCA101` to `MCA104`), credit distribution, internal marks breakdown ($/30$), and practical grades.
4. **Google Classroom**: Direct links to institutional course drives, lecture recordings, and submission portals.
5. **Course Materials**: Instant download links for syllabus PDFs, lecture slides, and faculty study materials.
6. **QR Attendance Check-In**: Real-time 1-click simulated QR check-in marking attendance in SQLite database instantly.
7. **Fee Ledger & Dues Clearance**: Complete fees breakdown (Tuition: ₹38,000, Exam: ₹2,500), clearance slip verification, and transaction history.
8. **Exams & Hall Ticket**: Seating arrangement block, exam dates, invigilation guidelines, and admit pass printing.
9. **v3 AI Risk & Digital Admit Pass**: Predictive Academic Risk Index (PARI) gauge, detainment warnings, mentor advisory, and SHA-256 sealed digital hall ticket.
10. **Market & Tech Radar**: Curated industry intelligence (Agentic AI, pgvector, LangGraph, LLM compiler trends).
11. **Support Tickets**: History of all student-raised grievance tickets with live status badges and faculty replies.

### 5.4 OakMitra AI Assistant & Multilingual Query Interface
- Full chat experience with persistent session history.
- Real-time streaming-like responses with confidence score indicators and official SOU source citations.
- Built-in suggested query chips for common questions (fees, exams, scholarships, placements).
- Automated ticket creation button when query confidence falls below 0.70.

### 5.5 Public & Authenticated Ticket Resolution Tracker
- Allows students to track ticket status with or without login using Ticket ID (e.g., `TKT-2026-0042`).
- Displays chronological timeline: Raised $\to$ Assigned $\to$ In Review $\to$ Resolved.

### 5.6 Faculty & HOD Resolution Command Workspace
- Ticket filtering: All, Open, Assigned, Resolved, In Progress.
- 1-click ticket claiming to prevent duplicate faculty effort.
- Rich resolution composer with option to mark ticket as candidate for automated KB retraining.
- Multi-department ticket reassignment drawer with internal notes.

### 5.7 Super Administrator Institutional Governance Centre
- Live institutional KPI cards: Total Queries Processed, Resolution Rate %, Active SLA Breaches, Average Response Time.
- Department load-distribution charts and resolution speed leaderboards.
- Candidate QA review console: Approve or reject faculty answers for automated RAG vector store re-indexing.
- 1-Click ERP Database Sync button for syncing demo attendance, marks, and fees.

---

## 6. Mathematical Formulations & Algorithmic Foundations

### 6.1 Confidence Grounding Score Formula
Every student query processed by the OakMitra AI Pipeline is evaluated using the composite grounding equation:

$$C(q, d) = w_1 \cdot S_{\text{semantic}}(q, d) + w_2 \cdot K_{\text{keyword}}(q, d) + w_3 \cdot I_{\text{intent}}(q)$$

Where:
- $w_1 = 0.50$: Cosine semantic similarity between query embedding and knowledge base vector chunk.
- $w_2 = 0.30$: BM25 token overlap / keyword match between query terms and document metadata.
- $w_3 = 0.20$: Intent classification confidence returned by the intent recognition agent.
- **Decision Thresholds**:
  - $C \ge 0.70$: `ACTION: ANSWER` $\to$ Instant grounded reply delivered to student with official citations.
  - $0.50 \le C < 0.70$: `ACTION: VERIFY` $\to$ Answer provided with caveat + 1-click button to escalate to faculty.
  - $C < 0.50$: `ACTION: ESCALATE` $\to$ Automatic multi-department ticket created and routed to faculty queue.

### 6.2 Reciprocal Rank Fusion (RRF) Retrieval Formula
In v3.0, dense vector search is fused with sparse lexical search using Reciprocal Rank Fusion:

$$\text{RRF}(d) = \sum_{m \in \{\text{Dense}, \text{Sparse}\}} \frac{1}{k + r_m(d)}$$

Where:
- $r_m(d)$ is the rank of document $d$ in retrieval method $m$.
- $k = 60$ is the standard smoothing constant to balance top-ranked dense semantics with exact circular numbers.

### 6.3 Predictive Academic Risk Index (PARI) Equation
The early warning detainment model calculates student academic vulnerability:

$$\text{PARI} = \min\left(100.0, \; \Delta_{\text{att}} + \Delta_{\text{marks}}\right)$$

Where:
$$\Delta_{\text{att}} = \begin{cases} (75.0 - \text{Att}) \times 2.0 & \text{if } \text{Att} < 75.0\% \\ (100.0 - \text{Att}) \times 0.15 & \text{if } \text{Att} \ge 75.0\% \end{cases}$$

$$\Delta_{\text{marks}} = \begin{cases} (40.0 - \text{Score}) \times 1.5 & \text{if } \text{Score} < 40.0\% \\ (100.0 - \text{Score}) \times 0.10 & \text{if } \text{Score} \ge 40.0\% \end{cases}$$

- $\text{PARI} \le 20$: `SAFE_EXEMPLARY` (Eligible for Dean's List and placement priority).
- $20 < \text{PARI} \le 45$: `MODERATE` (Mentor counseling notification triggered).
- $\text{PARI} > 45$: `CRITICAL` (Automated detainment warning flagged to HOD).

### 6.4 Cryptographic SHA-256 Digital Hall Ticket Verification Seal
To ensure admit cards cannot be forged or circulated with pending dues:

$$\text{Seal} = \text{SHA-256}\left(\text{StudentID} \parallel \text{EnrollmentNo} \parallel \text{ClearanceStatus} \parallel \text{SOU\_EXAM\_2026}\right)_{[0:16]}$$

---

## 7. Database Schema & Entity-Relationship Architecture

The database engine (`backend/helpdesk.db`) uses SQLite 3 with strict foreign key enforcement:

```
┌────────────────────┐          ┌────────────────────┐
│    departments     │1        ∞│      students      │
├────────────────────┤──────────├────────────────────┤
│ id (PK)            │          │ id (PK)            │
│ name               │          │ name               │
│ code               │          │ email              │
│ building, floor    │          │ enrollment_no      │
│ contact_email      │          │ department_id (FK) │
└────────────────────┘          │ semester, sgpa     │
           │1                   └────────────────────┘
           │                               │1
           │                               │
           │1                             ∞│
┌────────────────────┐          ┌────────────────────┐
│      faculty       │1        ∞│      tickets       │
├────────────────────┤──────────├────────────────────┤
│ id (PK)            │          │ ticket_id (PK)     │
│ name               │          │ student_id (FK)    │
│ email              │          │ dept_id (FK)       │
│ role (faculty/hod) │          │ query_text         │
│ department_id (FK) │          │ status, priority   │
└────────────────────┘          │ assigned_faculty_id│
                                └────────────────────┘
```

### Table Definitions Summary:
1. `departments`: 16 SOU constituent colleges & operational cells.
2. `students`: Enrolled student demographic data, enrollment IDs, program affiliations.
3. `faculty`: Teaching staff, HODs, HOIs, and administrative officers.
4. `tickets`: Central grievance repository with priority, lifecycle status, and resolution replies.
5. `ticket_assignments`: Multi-department routing mappings for composite issues.
6. `knowledge_base`: 7,790+ institutional FAQ records and scraped policy articles.
7. `kb_candidates`: Closed-loop learning queue for faculty answers awaiting admin approval.
8. `chat_history`: Audit trail of all AI assistant queries and grounding scores.
9. `student_attendance`: Course-wise lecture counts, attended sessions, and percentages.
10. `student_marks`: Mid-term exams, practical viva, continuous evaluation scores.
11. `student_fees`: Fee challans, paid amounts, outstanding balances, clearance flags.
12. `student_exams`: Examination schedules, room allocations, admit card permissions.

---

## 8. Complete API Route Directory (Including `/api/v3/...`)

### 8.1 System & v3 Enterprise Endpoints
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API Root status, engine version `3.0.0-Enterprise` | None |
| `GET` | `/api/health` | Service health and SQLite DB connectivity check | None |
| `GET` | `/api/v3/system/info` | v3.0 Architecture specifications and active modules | None |
| `GET` | `/api/v3/academic-risk/{student_id}` | Predictive Academic Risk Index (PARI) evaluation | Bearer Token |
| `GET` | `/api/v3/hall-ticket/{student_id}` | Cryptographic digital admit card generation | Bearer Token |
| `POST` | `/api/v3/ai/multilingual-query` | Gujarati/Hindi/English query normalization | None |
| `GET` | `/api/v3/announcements` | Campus-wide broadcast notifications feed | None |

### 8.2 Authentication & Profile Endpoints
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate email/password, returns JWT token | None |
| `POST` | `/api/auth/send-otp` | Generate OTP for mobile/email authentication | None |
| `POST` | `/api/auth/verify-otp` | Verify OTP code and issue session token | None |
| `POST` | `/api/auth/register` | Student self-registration with auto ERP seeding | None |
| `GET` | `/api/auth/faculty/me` | Fetch active faculty member profile & department | Bearer (Faculty) |
| `POST` | `/api/auth/faculty/change-password` | Update faculty portal access password | Bearer (Faculty) |

### 8.3 AI OakMitra Chat & Grounding Endpoints
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat/message` | Submit query to 10-Agent RAG pipeline | Optional Bearer |
| `GET` | `/api/chat/history` | Retrieve conversation history for active user | Bearer Token |
| `GET` | `/api/chat/suggested-queries` | Get contextual quick question chips | None |

### 8.4 Support Ticketing & Resolution Endpoints
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets/my` | Retrieve logged-in student's tickets | Bearer (Student) |
| `GET` | `/api/tickets/assigned` | Retrieve tickets assigned to logged-in faculty | Bearer (Faculty) |
| `GET` | `/api/tickets/track/{id}` | Public/Authenticated ticket resolution tracker | None |
| `POST` | `/api/tickets/{id}/reply` | Faculty submits resolution reply | Bearer (Faculty) |
| `POST` | `/api/tickets/{id}/reassign` | Reassign ticket to another department/staff | Bearer (Faculty/Admin)|
| `POST` | `/api/tickets/create-multi` | Create multi-department composite ticket | Optional Bearer |

### 8.5 Live ERP Simulation Cloud Endpoints
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/erp/student/summary` | SGPA, attendance %, courses, fees summary | Bearer (Student) |
| `GET` | `/api/erp/student/timetable` | Weekly course schedule with room numbers | Bearer (Student) |
| `GET` | `/api/erp/student/courses` | Enrolled subjects, faculty, credits | Bearer (Student) |
| `GET` | `/api/erp/student/marks` | Mid-sem marks and internal evaluations | Bearer (Student) |
| `GET` | `/api/erp/student/attendance` | Subject-wise attendance ledger | Bearer (Student) |
| `POST`| `/api/erp/student/attendance/qr-checkin` | Real-time QR attendance check-in | Bearer (Student) |
| `GET` | `/api/erp/student/fees` | Tuition ledger, receipts, clearance flag | Bearer (Student) |
| `GET` | `/api/erp/student/materials` | Downloadable course notes and syllabus | Bearer (Student) |
| `GET` | `/api/erp/student/exams` | Exam dates, seating blocks, hall tickets | Bearer (Student) |
| `POST`| `/api/erp/student/sync` | Trigger instantaneous cloud ERP sync | Bearer (Student) |

### 8.6 Super Admin Command & Governance Endpoints
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/analytics` | Institutional metrics, query counts, SLA stats | Bearer (Admin) |
| `GET` | `/api/admin/candidates` | Candidate Q&A pairs awaiting RAG retraining | Bearer (Admin) |
| `POST`| `/api/admin/candidates/{id}/approve` | Approve Q&A pair $\to$ Auto vector retrain | Bearer (Admin) |
| `POST`| `/api/admin/system/sync-erp` | Global bulk ERP synchronization | Bearer (Admin) |
| `GET` | `/api/super-admin/tickets` | System-wide ticket queue across all 16 depts | Bearer (SuperAdmin)|

---

## 9. Enterprise Cloud Infrastructure & AWS Blueprint

For high-availability institutional production deployment across 35,000+ students, the system maps to AWS cloud services:

```
                                      AWS Route 53 (DNS)
                                              │
                                              ▼
                                   AWS CloudFront (Global CDN)
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
          Amazon S3 Static Bucket                          Application Load Balancer (ALB)
          (React 19 / Vite Frontend)                       (SSL Termination & Path Routing)
                                                                       │
                                                                       ▼
                                                          AWS ECS Fargate Cluster
                                                          (FastAPI Docker Containers)
                                                                       │
                         ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
                         ▼                                             ▼                                             ▼
             Amazon RDS PostgreSQL                          Amazon ElastiCache Redis                      Amazon Bedrock / S3
          (Multi-AZ + pgvector Extension)                  (JWT Sessions & Chat Caching)                (Embeddings & Document Lake)
```

---

## 10. Verification, Quality Assurance & Test Validation

All route integrations, database integrity checks, and user persona workflows have been verified via end-to-end automation (`test_routes_integration.py`):

| Test Assertion | Endpoint Tested | Expected Outcome | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Test 1** | `GET /api/health` | HTTP 200, status: healthy | `{'status': 'healthy', 'database': 'connected'}` | ✅ PASS |
| **Test 2** | `GET /api/departments` | HTTP 200, count $\ge 16$ | `16 constituent departments loaded` | ✅ PASS |
| **Test 3** | `POST /api/auth/login` | Student token generated | `Feni Soni (Role: student) JWT issued` | ✅ PASS |
| **Test 4** | `GET /api/erp/student/summary`| SGPA $\ge 8.0$, Att $\ge 85\%$ | `SGPA=8.85, Attendance=91.25%, Courses=4` | ✅ PASS |
| **Test 5** | `GET /api/erp/student/timetable` | Schedule items $\ge 10$ | `16 scheduled classes loaded` | ✅ PASS |
| **Test 6** | `GET /api/erp/student/marks` | 4 subjects graded | `4 subjects with mid-sem scores loaded` | ✅ PASS |
| **Test 7** | `GET /api/erp/student/fees` | Clearance flag active | `Clearance: NO DUES CLEARED, Paid: ₹38,000` | ✅ PASS |
| **Test 8** | `POST .../qr-checkin` | Immediate attendance bump | `QR Code Verified! Room A-301 logged` | ✅ PASS |
| **Test 9** | `POST /api/auth/login` | Super Admin login | `Super Administrator JWT issued` | ✅ PASS |
| **Test 10**| `GET /api/admin/analytics` | Total queries $\ge 1,000$ | `Analytics loaded, total_queries=1822` | ✅ PASS |
| **Test 11**| `GET /api/auth/faculty/me` | Faculty profile loaded | `Prof. Meera Kapoor (SOCCA) verified` | ✅ PASS |
| **Test 12**| `POST /api/chat/message` | RAG Confidence $\ge 0.70$ | `Action: ANSWER, Confidence: 0.83` | ✅ PASS |
| **Test 13**| `GET /api/v3/system/info` | v3.0 Enterprise specs | `version: 3.0.0-Enterprise, status: STABLE` | ✅ PASS |
| **Test 14**| `GET /api/v3/academic-risk` | PARI evaluation safe | `risk_score: 2.45, tier: SAFE_EXEMPLARY` | ✅ PASS |
| **Test 15**| `GET /api/v3/hall-ticket` | SHA-256 seal present | `SEAL: SOU-VERIFIED-..., admitted: true` | ✅ PASS |

---

> **Approval Signature**: Dean & Head of Institute, Silver Oak College of Computer Application (SOCCA)  
> **Course Coordinator**: Course Code `IOM5091C` (M.Sc. IT & MCA) &bull; Silver Oak University, Ahmedabad
