# STUDANT_FRONTEND - Silver Oak University AI Student Help Desk

Student Portal for the Silver Oak University AI Student Help Desk system.

## 📌 Overview
This repository contains the **Student Frontend** for the Silver Oak University AI Help Desk. It provides an intelligent, automated query resolution interface for students with AI-powered conversational assistance and automated escalation to the university ticket routing system when necessary.

## 🚀 Key Features
- **AI-Powered Chat Interface**: Instant resolution of student queries using university knowledge base.
- **Confidence-Based Ticket Escalation**: Automatically prompts ticket creation if AI confidence is below threshold.
- **Smart Ticket Routing**: Integrated ticket creation and status tracking across university departments (Accounts, Exam, IT, Admissions, Faculty, etc.).
- **Ticket History & Tracking**: Real-time view of submitted tickets, assigned departments, faculty responses, and resolution status.
- **Modern Responsive UI**: Built with React, Vite, and Lucide icons for high-performance and accessible interactions.

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS with customized design system
- **Icons**: Lucide React
- **API Client**: REST API integration with FastAPI backend

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and set backend API URL:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
