# MediFlow Pharmacist

A desktop-focused pharmacist web application built with React + TypeScript + Vite and Material UI.

## Features

- OTP-based phone login
- Orders management with status updates
- Prescriptions view (orders with attached prescriptions)
- Medicine inventory with search
- Desktop-only (minimum 1100px viewport width)

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
├── context/      # AuthContext with localStorage persistence
├── pages/        # LoginPage, OrdersPage, PrescriptionsPage, InventoryPage
├── types.ts      # Shared TypeScript interfaces
└── theme.ts      # MUI theme
```

## Pages

| Route | Description |
|---|---|
| `/#/login` | OTP phone login |
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