# Business Nexus

> **Investor & Entrepreneur Collaboration Platform**  
> Built with React 18 · Vite · Tailwind CSS · React Router v6

---

## Overview

Business Nexus is a full-featured web platform that connects entrepreneurs seeking funding with investors looking for promising startups. It provides a complete collaboration environment — from profile discovery and messaging to video calls, document signing, and payment management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (JSX) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Icons | Lucide React |
| Date Utils | date-fns |
| Notifications | react-hot-toast |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Asakusa-k/Nexus.git
cd Nexus

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Entrepreneur | sarah@techwave.io | password123 |
| Investor | michael@vcinnovate.com | password123 |

---

## Project Structure

```
src/
├── App.jsx                          # Root router
├── main.jsx                         # Entry point
├── index.css                        # Tailwind base styles
│
├── context/
│   └── AuthContext.jsx              # Auth state & login/register logic
│
├── data/                            # Mock data layer
│   ├── users.js
│   ├── messages.js
│   ├── collaborationRequests.js
│   ├── calendarData.js
│   ├── documentsData.js
│   └── paymentsData.js
│
├── components/
│   ├── ui/                          # Reusable primitives
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Input.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── DashboardLayout.jsx
│   ├── chat/
│   ├── collaboration/
│   ├── entrepreneur/
│   ├── investor/
│   ├── calendar/
│   ├── videocall/
│   ├── payments/
│   ├── security/
│   └── walkthrough/
│
└── pages/
    ├── auth/                        # Login, Register, Forgot/Reset Password
    ├── dashboard/                   # Entrepreneur & Investor dashboards
    ├── profile/                     # Entrepreneur & Investor profiles
    ├── investors/                   # Investor discovery
    ├── entrepreneurs/               # Startup discovery
    ├── chat/                        # Real-time messaging
    ├── messages/
    ├── notifications/
    ├── documents/                   # File vault + Document Chamber
    ├── deals/                       # Investment deal tracking
    ├── calendar/                    # Meeting scheduling
    ├── videocall/                   # Video call interface
    ├── payments/                    # Wallet & transactions
    ├── security/                    # 2FA & access control
    ├── settings/
    └── help/
```

---

## Features

### Core Platform
- **Authentication** — Login, Register, Forgot Password, role-based routing
- **Dual Dashboards** — Separate views for Entrepreneurs and Investors
- **Profile Pages** — Rich startup and investor profiles
- **Discovery** — Search and filter investors or startups
- **Messaging** — Full conversation UI with real-time chat
- **Collaboration Requests** — Send, accept, or decline partnership requests
- **Notifications** — Activity feed
- **Documents** — File vault with upload and download
- **Deals** — Investment pipeline table with status tracking

### Advanced Features (Week 1–3)

#### Week 1 — Calendar
- Custom calendar grid built without external library
- Add availability slots (open/booked)
- Schedule meeting requests with title, time, and notes
- Accept or decline incoming meeting requests
- All meetings listed in a sortable table

#### Week 2 — Video Calls
- Full video call UI (WebRTC-ready frontend)
- Mic on/off, camera on/off, screen share toggle
- In-call chat panel with message history
- Participants panel
- Quick dial from contacts list
- Instant meeting start without scheduling

#### Week 2 — Document Chamber
- Upload documents with drag-and-drop zone
- Status labels: **Draft** / **In Review** / **Signed**
- Signature progress bar per document
- Interactive canvas-based e-signature pad
- Document preview modal with signature history

#### Week 3 — Payments
- Stripe-style wallet card with balance toggle
- Deposit, Withdraw, Transfer modals with validation
- Escrow balance display
- Transaction history table with search and type filter
- Funding Deal Flow tracker (step-by-step pipeline)

#### Week 3 — Security
- Password strength meter with 6-point checklist
- Two-factor authentication mockup (OTP input pad)
- Active sessions manager with revoke option
- Role-based access permissions table
- Password change form with show/hide toggle

#### Week 3 — Guided Tour
- Floating "Tour" button on all authenticated pages
- Step-by-step tooltip walkthrough of all major features
- Progress dots, next/prev navigation, keyboard-friendly

---

## Routes

| Path | Component | Access |
|---|---|---|
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/forgot-password` | ForgotPasswordPage | Public |
| `/reset-password` | ResetPasswordPage | Public |
| `/dashboard/entrepreneur` | EntrepreneurDashboard | Auth |
| `/dashboard/investor` | InvestorDashboard | Auth |
| `/profile/entrepreneur/:id` | EntrepreneurProfile | Auth |
| `/profile/investor/:id` | InvestorProfile | Auth |
| `/investors` | InvestorsPage | Auth |
| `/entrepreneurs` | EntrepreneursPage | Auth |
| `/messages` | MessagesPage | Auth |
| `/chat/:userId` | ChatPage | Auth |
| `/notifications` | NotificationsPage | Auth |
| `/documents` | DocumentsPage | Auth |
| `/deals` | DealsPage | Auth |
| `/calendar` | CalendarPage | Auth |
| `/video-call` | VideoCallPage | Auth |
| `/document-chamber` | DocumentChamberPage | Auth |
| `/payments` | PaymentsPage | Auth |
| `/security` | SecurityPage | Auth |
| `/settings` | SettingsPage | Auth |
| `/help` | HelpPage | Auth |

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) and it deploys automatically on every push.

Add this `vercel.json` to handle client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT License — free to use, modify, and distribute.

---

*Business Nexus — Connecting Capital with Innovation*
