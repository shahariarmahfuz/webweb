# Nebula Bazaar

Simple buy/sell marketplace demo with a lightweight admin panel. Designed for Railway deployment.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Railway deploy guide

1. Push this repo to GitHub.
2. Create a new Railway project.
3. Select **Deploy from GitHub Repo** and pick the repo.
4. Railway will detect `Procfile` and run:

```
web: node server.js
```

5. Deploy and open the generated Railway URL.

### Notes for Railway

- This project embeds the Turso URL/token directly in `server.js` as requested (no `.env`).
- Admin panel is available at `/admin.html` and has no authentication for now.
