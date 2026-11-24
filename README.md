# Tejamkor.uz — MVP

Tejamkor.uz is a React + Vite demo marketplace for discounted surplus food.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Demo access

- Admin route: `/#/admin`
- Default demo password: `admin123`
- Seller route: `/#/seller` (enter a store name to create/use a demo seller profile)

To change the demo admin password before deployment, set `VITE_ADMIN_PASSWORD` in your Vercel project environment variables.

## MVP notes

- Products, favorites, and orders are stored in the current browser's LocalStorage.
- This is a presentation MVP: LocalStorage data is not shared between different devices or browsers.
- The store and map locations are demo data.
- Product photos are loaded from Unsplash and require an internet connection.
- Do not use this demo password or LocalStorage setup for real payments or sensitive customer data. A shared backend and proper authentication are needed before production use.
