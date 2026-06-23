# 🚀 Dhananjay Gurjar — Portfolio

A high-performance, visually immersive personal portfolio featuring WebGL shaders, Three.js 3D graphics, GSAP animations, and a Node.js backend for project proposal submissions.

## 📁 Project Structure

```
├── frontend/           # Static frontend assets
│   ├── review.html     # Main portfolio page (production)
│   ├── index2.html     # Alternate version
│   └── index.htm       # Legacy version
│
├── backend/            # Express.js API server
│   ├── server.js       # Main server — routes, email, Supabase
│   ├── package.json    # Dependencies
│   └── .env            # Environment secrets (not committed)
│
├── .gitignore          # Keeps secrets & node_modules private
└── README.md           # You are here
```

## ⚡ Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
#    Edit backend/.env with your credentials

# 3. Start development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, Tailwind CSS, Three.js, GSAP, WebGL Shaders |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Email** | Nodemailer (Gmail SMTP) |

## 📬 Features

- **Project Proposal Form** — Visitors can submit project requests
- **Dual Email Notifications** — Thank-you email to visitor + notification to owner
- **Supabase Storage** — All proposals saved and viewable from dashboard
- **WebGL Background** — Interactive mouse-reactive noise shader
- **3D Hero Scene** — Three.js icosahedron wireframe with parallax
- **Scroll Animations** — GSAP-powered card stacking & reveal effects

## 📝 License

© 2026 Dhananjay Gurjar. All rights reserved.
