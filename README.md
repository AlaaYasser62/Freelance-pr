# FreelanceOS — Frontend Dashboard

A modern, full-featured freelancer management dashboard built with React + Vite + Tailwind CSS.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## 🔑 Demo Login

On the login page, click either demo button:

| Role           | What you get                                         |
| -------------- | ---------------------------------------------------- |
| **Freelancer** | Full dashboard — stats, projects, clients, invoices  |
| **Client**     | Read-only portal — view projects & download invoices |

---

## 📁 Project Structure

```
src/
├── App.jsx                        # Router + protected routes
├── main.jsx
├── styles/globals.css             # Tailwind + custom CSS vars
│
├── data/
│   └── mockData.js                # All fake data (clients, projects, invoices…)
│
├── lib/
│   └── utils.js                   # formatCurrency, formatDate, cn(), etc.
│
├── hooks/
│   ├── useAuth.jsx                # Auth context (login/register/role/logout)
│   └── useKanbanDrag.js           # Drag-and-drop state helper
│
├── components/
│   ├── layout/
│   │   └── DashboardLayout.jsx    # Sidebar + top navbar shell
│   └── ui/
│       └── index.jsx              # Badge, StatCard, Modal, Avatar, TabBar…
│
└── pages/
    ├── LandingPage.jsx            # Hero + features + testimonials + CTA
    ├── auth/
    │   ├── ForgetPasswordPage.jsx
    │   ├──LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   └── RoleSelectPage.jsx
    ├── dashboard/
    │   └── DashboardHome.jsx      # Stats, revenue chart, deadlines, activity
    ├── clients/
    │   └── ClientsPage.jsx        # Table + search + add/edit modal
    ├── projects/
    │   ├── ProjectsPage.jsx       # Grid/list view + filters
    │   └── ProjectDetailPage.jsx  # Overview, Kanban (drag-and-drop), Time Logs
    ├── invoices/
    │   ├── InvoicesPage.jsx       # Table + status filters
    │   └── InvoiceDetailPage.jsx  # Full invoice preview + PDF export UI
    └── portal/
        └── ClientPortalPage.jsx   # Read-only client view
```

---

## 🛠 Tech Stack

| Library         | Purpose                         |
| --------------- | ------------------------------- |
| React 18        | UI framework                    |
| Vite 5          | Build tool / dev server         |
| Tailwind CSS 3  | Utility-first styling           |
| React Router 6  | Client-side routing             |
| Framer Motion   | Page/component animations       |
| Recharts        | Revenue area chart on dashboard |
| Lucide React    | Icon library                    |
| date-fns        | Date formatting                 |
| clsx + tw-merge | Conditional classname utilities |

---

## 🎨 Design System

Dark theme tokens defined in `tailwind.config.js`:

- `bg-base / bg-subtle / bg-muted` — page backgrounds
- `surface / surface-raised / surface-overlay` — card layers
- `border / border-subtle / border-strong` — border hierarchy
- `accent-cyan / accent-purple / accent-emerald / accent-amber / accent-rose` — brand accents
- `text-primary / text-secondary / text-muted` — typography scale

---

## 📄 Pages & Routes

| Route                     | Page                    |
| ------------------------- | ----------------------- |
| `/`                       | Landing page            |
| `/login`                  | Login                   |
| `/register`               | Register                |
| `/role-select`            | Role chooser            |
| `/dashboard`              | Dashboard home          |
| `/dashboard/clients`      | Clients table           |
| `/dashboard/projects`     | Projects grid/list      |
| `/dashboard/projects/:id` | Project detail + kanban |
| `/dashboard/invoices`     | Invoices table          |
| `/dashboard/invoices/:id` | Invoice detail + export |
| `/portal/:token`          | Client portal (demo)    |
