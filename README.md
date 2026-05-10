# 🌍Traveloop — Personalized Travel Planning Platform

Traveloop is a full-stack travel planning platform that helps users create, organize, and manage personalized multi-city trips with an interactive and modern experience.

The platform enables travelers to:
- Create and manage trips
- Build detailed itineraries
- Search cities and activities
- Estimate travel budgets
- Maintain packing checklists
- Add travel notes/journals
- Share itineraries publicly
- Visualize trip analytics

Built as a scalable full-stack application using modern web technologies.

---

# Features

## Authentication
- User Signup
- User Login
- Forgot Password (Placeholder)
- Static Authentication (JWT integration planned)

---

## Dashboard
- Personalized welcome section
- Recent trips overview
- Budget highlights
- Recommended destinations
- Quick actions & stats

---

## Trip Management
- Create new trips
- Edit trip details
- Delete trips
- View all trips
- Add trip cover images

---

## Itinerary Builder
- Add multiple city stops
- Reorder travel stops
- Add activities per stop
- Timeline-based itinerary planning
- Interactive travel flow

---

## Activity Search
- Browse travel activities
- Filter by category, duration, and cost
- Add/remove activities to itinerary

---

## City Search
- Search destinations
- Filter by region/country
- Dynamic city suggestions

---

## Budget Management
- Cost breakdown by:
  - Transport
  - Stay
  - Food
  - Activities
- Budget analytics
- Daily average expense calculation
- Visual charts

---

## Packing Checklist
- Add checklist items
- Mark items as packed
- Categorize travel essentials
- Reset checklist

---

## Travel Notes / Journal
- Add personal notes
- Edit/Delete notes
- Trip-specific journaling
- Timestamp tracking

---

## Shared/Public Itineraries
- Public itinerary view
- Shareable links
- Read-only trip access
- Copy trip functionality (planned)

---

## User Profile & Settings
- Update profile
- Manage preferences
- Avatar support
- Saved destinations

---

## Admin Analytics Dashboard
- Total users
- Total trips
- Popular cities
- Popular activities
- Platform analytics

---

# Tech Stack

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- ShadCN UI
- Zustand
- React Router DOM
- Axios
- Framer Motion
- Recharts

---

## Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL

---

## Database
- MySQL (Relational Database)

---

## Tools & Libraries
- Prisma
- Zod / Joi
- bcrypt
- Multer
- Helmet
- Morgan
- CORS
- Express Rate Limit

---

# 📂 Project Structure

```bash
TravelLoop/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---


# API Architecture

The application follows a modular monolithic architecture.

## Core Modules
- Auth
- Users
- Trips
- Itinerary
- Activities
- Budgets
- Checklist
- Notes
- Sharing
- Analytics

---

# Backend Architecture

```bash
backend/
│
├── src/
│   ├── modules/
│   ├── middlewares/
│   ├── config/
│   ├── utils/
│   ├── routes/
│   ├── app.js
│   └── server.js
```

---

# Frontend Architecture

```bash
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── store/
│   └── layouts/
```

---

# Security Features

- Password hashing with bcrypt
- Helmet security middleware
- CORS protection
- Rate limiting
- Environment variable protection
- Prisma ORM query safety

---

# Future Improvements

- JWT Authentication
- OAuth Login
- Real-time collaboration
- AI-powered trip recommendations
- Google Maps integration
- Hotel & Flight APIs
- Notifications
- Offline support
- PWA support

---


# Hackathon Vision

Traveloop aims to simplify travel planning through a highly interactive and intelligent platform that combines:
- itinerary management
- budgeting
- collaboration
- personalization
- modern user experience

into one seamless ecosystem.

---

# 📄 License

This project is developed for educational and hackathon purposes.

---

# ⭐ Contributors

- Backend Development
- Frontend Development
- UI/UX Design
- System Architecture

Built with ❤️ using modern full-stack technologies.
