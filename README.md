# Warung Tycoon: Midnight Shift

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-PLAY_NOW-F59E0B?style=for-the-badge&labelColor=181512)](https://nplwi.github.io/warung-tycoon/)

> Play directly in your browser: https://nplwi.github.io/warung-tycoon/

A cozy, fast-paced 5-minute Indonesian late-night roadside coffee stall (*Warung Kopi / Angkringan*) micro-management game built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

## Features

- **5-Minute Midnight Shift (00:00 – 05:00 WIB):** Real-time 300-second shifts (1 real-time minute = 1 in-game hour) with a rush-hour spike between **01:00 – 03:00**.
- **Customer Archetypes & Patience:** Serve *Mahasiswa Begadang*, *Ojol Malam*, and *Pekerja Shift* across 4 counter slots. Earn speed tips for quick service or lose reputation if they leave angry.
- **Interactive Prep Workbench:**
  - **Stasiun Minuman:** Boil water in the kettle and brew *Kopi Hitam*, *Teh*, or *Susu Jahe* (with *Manis/Tanpa Gula* and *Panas/Es* options).
  - **Wajan Penggorengan & Rak Hangat:** Fry *Tahu Isi*, *Tempe Mendoan*, and *Bakwan*—lift them when golden before they burn (*gosong*), and serve them while warm.
  - **Nampan Saji & Nasi Kucing:** Assemble exact multi-item orders and grab *Nasi Kucing* from stock.
- **Between-Shift Upgrades & Restock:** Spend earned `Rp` on *Kompor Tekanan Tinggi*, *Wajan Lebih Besar*, *Termos & Rak Hangat*, and wholesale ingredient restocking.
- **Synthesized Web Audio SFX:** Subtle procedural sound effects for arrival bells, boiling water, frying sizzle, and cash register chimes (no external audio assets).
- **Local Persistence:** Automatically saves cash, high scores, unlocked days, inventory, and upgrades to `localStorage`.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite dev server
npm run dev

# 3. Type-check and build for production
npm run build
```

## Deploying to GitHub Pages

This repository is pre-configured for static deployment on GitHub Pages (`vite.config.ts` uses `base: './'`) and includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Push your code to the `main` branch on GitHub.
2. In your GitHub repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build `dist/` and deploy it to `https://<username>.github.io/<repo-name>/`.
