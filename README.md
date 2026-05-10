# Lead Management System (Mini CRM)

A simple full-stack Lead Management System built using:

- React.js
- Node.js
- Express.js
- PostgreSQL

---

# Features

## Frontend
- Add new leads
- Display all leads
- Update lead status
- Delete leads
- Search leads
- Filter leads
- Dashboard analytics
- Form validation

## Backend
- REST APIs
- Error handling
- PostgreSQL integration

## Database
- Structured PostgreSQL table
- Lead status management

---

# Tech Stack

Frontend:
- React
- Axios
- CSS

Backend:
- Node.js
- Express.js

Database:
- PostgreSQL

---

# Installation

## Backend Setup

```bash
cd backend
npm install
npm start
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# Database Setup

Create database:

```sql
CREATE DATABASE mini_crm;
```

Run table query from `database.sql`.

---

# API Endpoints

## Add Lead

POST `/leads`

## Get Leads

GET `/leads`

## Update Lead Status

PUT `/leads/:id`

## Delete Lead

DELETE `/leads/:id`

---

# Author

Shalini Verma