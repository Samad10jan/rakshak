# <img width="34" height="38" alt="rakshak" src="https://github.com/user-attachments/assets/0b6b32c2-abec-46a2-9aaf-330d6227fe4a" /> Rakshak — Women Safety Platform

**Rakshak** is a full-stack women's safety ecosystem consisting of a **React Native mobile app**, a **Next.js REST API**, and a **minimal web dashboard** — enabling real-time SOS alerts, media evidence capture, and trusted contact management.

---

## 🌐 Live

| Resource | URL |
|---|---|
| API Base URL | `https://rakshak-gamma.vercel.app/api/` |
| Web Dashboard | `https://rakshak-gamma.vercel.app` |

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Mobile App | React Native |
| Backend / API | Next.js (API Routes) |
| Database | MongoDB via Prisma |
| Media Storage | Cloudinary |
| Auth | JWT (web dashboard) |
| Deployment | Vercel |

---

## ✨ Features

### Mobile App (React Native)
- One-tap SOS alert with live GPS location
- Auto-capture photos and audio during emergencies
- Manage trusted contacts (name + phone)
- Set a custom code word and emergency message
- View personal SOS history

### Web Dashboard (Next.js)
- Sign in with JWT-protected authentication
- View full SOS history with **date filtering**
- Inspect each SOS: location, status, attached media (photos & audio)
- Live location polling for active SOS alerts
- API documentation page with interactive test panel (access-code protected)

---

## 📡 API Reference

All endpoints are prefixed with `https://rakshak-gamma.vercel.app/api/`

### 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user. Required: `email`, `username`, `phoneNumber`, `password` |
| `POST` | `/auth/signin` | Sign in by phone number and password |

<details>
<summary>Signup example</summary>

**Request**
```json
{
  "email": "user@example.com",
  "username": "Riya",
  "phoneNumber": "9827453783",
  "password": "jkAbc!@12"
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "68fcc70c132244eaf83b68b0",
    "username": "Riya",
    "email": "user@example.com",
    "phoneNumber": "9827453783",
    "createdAt": "2025-10-25T12:48:12.732Z"
  }
}
```
</details>

---

### 👤 User

| Method | Endpoint | Description |
|---|---|---|
| `GET / PUT / DELETE` | `/user/[id]` | Fetch, update, or delete a user by ID |
| `GET / PUT` | `/user/[id]/details` | Fetch or update user details (address, codeWord, message) |

---

### 🤝 Trusted Friends

| Method | Endpoint | Description |
|---|---|---|
| `GET / POST` | `/user/[id]/trusted-friends` | List or add a trusted contact |
| `PUT / DELETE` | `/user/[id]/trusted-friends/[friendId]` | Edit or remove a specific contact |

<details>
<summary>Add friend example</summary>

**Request**
```json
{ "name": "Ali", "phone": "9876543211" }
```

**Response**
```json
{
  "success": true,
  "message": "Friend added successfully",
  "friend": { "id": "8s7d09as8d0a9", "name": "Ali", "phone": "9876543211" }
}
```
</details>

---

### 🚨 SOS Alerts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/sos-alert` | Create a new SOS alert with GPS coordinates |
| `GET / PUT / DELETE` | `/sos-alert/[id]` | Manage a specific SOS alert |
| `GET` | `/sos-alert/user/[userId]` | Fetch all SOS alerts for a user |

<details>
<summary>Create SOS example</summary>

**Request**
```json
{
  "userId": "68ffa766ac0cd72ed42de692",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "status": "active"
}
```

**Response**
```json
{
  "success": true,
  "sos": {
    "id": "6530a1f3b5c7da1a5a2b2cd9",
    "timestamp": "2025-10-25T11:32:56.492Z",
    "location": { "lat": 12.9716, "lng": 77.5946 },
    "status": "active"
  }
}
```
</details>

---

### 🗂️ Media

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/media/upload` | Upload images and/or audio linked to an SOS alert |
| `GET / DELETE` | `/media/[id]` | Fetch or delete a specific media file (also removes from Cloudinary) |
| `GET` | `/user/[id]/media` | Fetch all media across a user's SOS alerts *(planned)* |

**Upload limits:** Images up to **13 MB**, audio up to **15 MB**. Files are stored in Cloudinary under `Rakshak_uploads/images` and `Rakshak_uploads/audio`.

<details>
<summary>Upload media example</summary>

**Form fields**
```
sosAlertId  — string (required)
files       — image files (multiple)
audio       — single audio file (optional)
title       — string (optional)
description — string (optional)
```

**Response**
```json
{
  "uploaded": [
    {
      "id": "media123",
      "sosAlertId": "6530a1f3b5c7da1a5a2b2cd9",
      "type": "photo",
      "url": "https://res.cloudinary.com/...",
      "format": "jpg",
      "uploadedAt": "2025-10-25T11:33:00.000Z"
    }
  ]
}
```
</details>

---

## 🖥️ Web Dashboard Screenshots

| Page | Preview |
|---|---|
| Landing Page | ![Landing](https://github.com/user-attachments/assets/03444523-aa7e-4803-a476-27631e9d8e53) |
| SOS History (with date filter) | ![SOS History](https://github.com/user-attachments/assets/4d2f6aad-cf43-4cf0-b5c5-e606cf8ebad0) |
| Active SOS Alert | ![Active SOS](https://github.com/user-attachments/assets/d38c7f80-2b6c-43d2-983d-8bcabd162079) |
| Individual SOS with Media | ![SOS Media](https://github.com/user-attachments/assets/c091f710-92ac-4fde-8605-d67bbc79ca3c) |
| SOS Location Polling | ![Location Polling](https://github.com/user-attachments/assets/d825033f-8434-4a21-8248-c998ee5ce4dd) |
| API Docs Page | ![API Docs](https://github.com/user-attachments/assets/8a46959e-c656-47a3-b826-10202f749dce) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB connection string
- Cloudinary account

### Environment Variables

```env
DATABASE_URL=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=...
```

### Install & Run

```bash
git clone https://github.com/your-username/rakshak
cd rakshak
npm install
npm run dev
```

---
## 📁 Project Structure
```
RAKSHAK/
├── .next/
├── generated/
├── node_modules/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   ├── documentation/
│   │   │   └── page.tsx            # API docs page
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── sos/
│   │   │   ├── [sosId]/
│   │   │   │   └── page.tsx        # Individual SOS page
│   │   │   └── page.tsx            # SOS history page
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Landing page
│   ├── components/
│   └── lib/
├── .env
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
└── tsconfig.json

```

## 📁 APi Structure

```
src/
└── app/
    └── api/
        ├── auth/
        │   ├── signin/
        │   │   └── route.ts
        │   └── signup/
        │       └── route.ts
        ├── media/
        │   ├── [id]/
        │   │   └── route.ts        # GET, DELETE specific media
        │   └── upload/
        │       └── route.ts        # POST upload images/audio
        ├── sos-alert/
        │   ├── [id]/
        │   │   └── route.ts        # GET, PUT, DELETE specific alert
        │   ├── user/[userId]/
        │   │   └── route.ts        # GET all alerts for a user
        │   └── route.ts            # POST create new alert
        └── user/[id]/
            ├── details/
            │   └── route.ts        # GET, PUT user details
            ├── trusted-friends/
            │   ├── [friendId]/
            │   │   └── route.ts    # PUT, DELETE specific friend
            │   └── route.ts        # GET, POST trusted friends
            └── route.ts            # GET, PUT, DELETE user
```
