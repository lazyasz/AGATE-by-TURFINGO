# 🎮 Agate Esports — MVP Registration Platform

A responsive tournament registration platform for **Agate Esports** with a dark gaming-themed UI, built with pure HTML, CSS, and JavaScript.

![Agate Esports](https://img.shields.io/badge/Agate-Esports-00e5ff?style=for-the-badge&logo=gamepad&logoColor=white)

## ✨ Features

- **Landing Page** — Hero section with animated taglines, featured tournaments, and stats
- **User Registration & Login** — Full auth flow with form validation
- **Tournament Listing** — 6 tournaments with search, game/status filters, and progress bars
- **Team Registration** — Dynamic player roster builder (3–7 players per team)
- **Registration Confirmation** — Summary with unique registration ID
- **Admin Dashboard** — Stats overview, searchable teams table with expandable player details

## 🎨 Design

- Dark gaming aesthetic inspired by [agateesports.com](https://agateesports.com)
- **Fonts**: Bebas Neue (headings) + Space Mono (body)
- Cyan accent (`#00e5ff`) with blueprint grid background
- Glassmorphism cards, glow effects, smooth animations
- Fully responsive (desktop, tablet, mobile)

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/AshwinGaikwad-Git/agate-esports.git
cd agate-esports

# Serve locally (any static server works)
npx http-server . -p 8080 -c-1

# Open http://127.0.0.1:8080
```

## 🔐 Admin Access

| Email | Password |
|-------|----------|
| `admin@agate.gg` | `admin123` |

## 📁 Project Structure

```
agate-esports/
├── index.html            # Landing page
├── login.html            # Login page
├── register.html         # User registration
├── tournaments.html      # Tournament listing
├── team-registration.html # Team registration form
├── confirmation.html     # Registration confirmation
├── admin.html            # Admin dashboard
├── styles.css            # Design system & styles
├── app.js                # Core application logic
└── README.md
```

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **JavaScript** — Vanilla ES6+ with localStorage persistence
- **No frameworks** — Zero dependencies, lightweight MVP

## 📄 License

MIT License — feel free to use and modify.
