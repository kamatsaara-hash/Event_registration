# 🎟️ Event Registration System

A full-stack Event Registration platform built using **Next.js (TypeScript)**, **FastAPI (Python)**, and **MongoDB Atlas**.  
It allows users to register, create/join teams, and participate in events with strict team rules and real-time data updates.



## 🚀 Overview

This project is designed for **college events, hackathons, and club registrations**, enabling:

- Secure user authentication
- Team creation and management
- Event registration system
- Real-time slot tracking
- Role-based team control (leader/member system)



## ✨ Features

### 🔐 Authentication
- User Signup and Login
- Secure backend API integration (FastAPI)
- Session/token-based authentication (if implemented)



### 👥 Team Management
- Create teams (auto-assigned leader)
- Join existing teams
- Leave team anytime
- Leader-only permissions for control
- Team constraints:
  - Minimum members: 2
  - Maximum members: 6
- Registration automatically stops when team is full



### 🎟️ Event System
- View all available events
- See participants per event
- Track remaining slots dynamically
- Prevent over-registration when slots are full



### 📊 Dashboard
- Central event dashboard
- Team status overview
- Participant tracking
- Slot availability monitoring

---

## 🎨 Frontend Tech Stack

- **Core Language:** TypeScript (JavaScript with static typing)
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (utility-first styling)
  - Example: `bg-primary`, `text-muted-foreground`
- **API Communication:** Axios
  - Used for all HTTP requests to FastAPI backend
- **Animations:** Framer Motion
  - Smooth UI transitions using `motion.div`
- **Icons:** Lucide React
  - Icons such as Camera, CheckCircle, User, etc.

---

### 🌐 API Integration (Frontend)
- Axios handles all communication with backend APIs
- Used for:
  - Authentication requests
  - Team creation/join/leave
  - Fetching events and participants
- Centralized API calls for clean architecture



##  Backend Tech Stack

- FastAPI (Python)
- Pydantic (data validation)
- REST API architecture
- Uvicorn server



## Database

- MongoDB Atlas (Cloud NoSQL database)
- Collections:
  - Users
  - Teams
  - Events


