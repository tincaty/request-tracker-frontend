Here’s a **ready-to-copy version** of your README for the frontend repo:

````markdown
# Feature Request Tracker - Frontend

This is the **React.js frontend** for the **Feature Request Tracker** application, part of a full-stack technical task for Tanzanite Skills Academy.

---

## Technology Stack

- **Frontend:** React.js

---

## Features

The application allows users to:

- View all feature requests
- Add a new feature request
- Edit a feature request
- Delete a feature request
- Update feature status
- Filter feature requests by status

Each feature request includes the following fields:

- **Title**
- **Description**
- **Priority:** Low / Medium / High
- **Status:** Open / In Progress / Completed
- **Created Date**

---

## Requirements

- Clean and modern UI built with React.js
- Connects to Node.js backend API
- Proper validation and error handling
- Reusable components for feature cards, tables, and forms
- Fully responsive design

---

## Installation and Setup

1. **Clone the repository:**

```bash
git clone https://github.com/tincaty/request-tracker-frontend.git
cd request-tracker-frontend
````

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following:

```env
VITE_API_BASE_URL=http://localhost:9000/api/features
```

4. **Run the application:**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Connecting to Backend

The frontend communicates with the Node.js + Express backend API:

* **Base URL:** `VITE_API_BASE_URL`
* **Endpoints:**

  * `GET /features` – List all features
  * `POST /features` – Create a new feature
  * `PUT /features/:id` – Update a feature
  * `PATCH /features/:id` – Update feature status
  * `DELETE /features/:id` – Delete a feature

---

## Project Structure

```text
src/
├── components/       # Reusable UI components (FeatureCard, FeatureTable, Forms)
├── context/          # React context for state management
├── services/         # API request functions
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── App.tsx           # Main app entry
```

---

## Notes

* Ensure the backend is running before starting the frontend.
* Designed with a focus on code readability, reusability, and maintainability.

```

You can **copy-paste this directly** into your `README.md` file.
```
