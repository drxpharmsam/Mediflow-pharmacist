# MediFlow Pharmacist

A fully-responsive pharmacist web application built with React + TypeScript + Vite and Material UI, featuring a glassmorphism UI with the **Blueberry Cotton Candy** palette (`#FFB7FD`, `#A8C0EE`, `#C58BE5`).

> ⚠️ **TEST / DEV MODE — OTP Auth:** The OTP authentication system is currently running in **TEST MODE**. Any valid email + phone combination can be used. The OTP for both email and phone is **`123456`**. This is clearly labelled in the UI. Backend OTP integration will be enabled once the server is updated.

## Features

- Sign In / Register flow with email + phone identity inputs
- Test OTP verification (fixed OTP `123456` — TEST MODE, displayed in UI)
- Onboarding flow: personal info (name, age, gender, photo, shop address) + geolocation capture
- Session persisted in `localStorage`
- Orders management with status updates
- Prescriptions view (orders with attached prescriptions)
- Medicine inventory with search
- Fully responsive (mobile bottom nav + desktop sidebar)
- Glassmorphism UI with Blueberry Cotton Candy palette

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Material UI v5**
- **React Router v6**
- **Axios**

## Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Configure environment

Copy the example env file and set the backend URL:

```bash
cp .env.example .env
```

Edit `.env` if you need to point to a different backend:

```
VITE_API_BASE_URL=https://mediflow-backend-z29j.onrender.com
```

### Run in development mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/          # Axios API modules (auth, orders, medicines)
├── components/   # Shared components (Layout, DesktopGuard, OrdersTable, ProtectedRoute)
├── context/      # AuthContext with localStorage persistence + profile management
├── pages/        # LoginPage, OnboardingPage, OrdersPage, PrescriptionsPage, InventoryPage
├── types.ts      # Shared TypeScript interfaces (User, UserProfile, Order, Medicine)
└── theme.ts      # MUI theme + glassmorphism helpers
```

## Pages

| Route | Description |
|---|---|
| `/#/login` | Sign In / Register with email + phone + test OTP |
| `/#/onboarding` | Personal info + location setup (new users) |
| `/#/orders` | All orders table with status update |
| `/#/prescriptions` | Orders with prescriptions attached |
| `/#/inventory` | Medicine catalog with search |

## Deployment – GitHub Pages

The app is configured to deploy to GitHub Pages at `https://<user>.github.io/Mediflow-pharmacist/`.

### Automatic deployment

Pushing to the `main` branch triggers the [GitHub Actions workflow](.github/workflows/deploy.yml) which builds the app and deploys it to Pages automatically.

Enable GitHub Pages in the repository settings:

1. Go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.

The live site will be available at `https://drxpharmsam.github.io/Mediflow-pharmacist/`.

### Manual deployment

```bash
npm run build
# Upload the contents of dist/ to your hosting provider
```