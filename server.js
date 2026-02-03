const express = require("express");
const path = require("path");
const { createClient } = require("@libsql/client");
const { nanoid } = require("nanoid");

const app = express();
const port = process.env.PORT || 3000;

const TURSO_URL = "https://nemo-nekot.aws-ap-south-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzAxMDA0MDksImlkIjoiZjYyZmM2YTMtNGYyOS00NjgyLThlZGYtYmRiZjJmODRjYzg3IiwicmlkIjoiYjA3NDdjODctYTBiMy00ZjA0LWE0MzMtMjIwNzI5M2NjOGY1In0.eBrmS3ONAhHU_oJ4oXTtEv-xANl-DF79D8Bxv87AmQUVM8qt4DaRyMAUKmmIVAi_kaVTnXNMfVfHbtrN3uHBAA";

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      category TEXT NOT NULL,
      condition TEXT NOT NULL,
      location TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

app.get("/api/listings", async (req, res) => {
  try {
    const result = await db.execute(
      "SELECT * FROM listings ORDER BY datetime(created_at) DESC"
    );
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to load listings." });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM listings WHERE id = ?",
      args: [req.params.id]
    });
    const listing = result.rows[0];
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }
    res.json({ data: listing });
  } catch (error) {
    res.status(500).json({ error: "Failed to load listing." });
  }
});

app.post("/api/listings", async (req, res) => {
  const { title, description, price, category, condition, location, imageUrl } =
    req.body || {};

  if (
    !title ||
    !description ||
    !price ||
    !category ||
    !condition ||
    !location ||
    !imageUrl
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const id = nanoid();
  const createdAt = new Date().toISOString();

  try {
    await db.execute({
      sql: `
        INSERT INTO listings (
          id, title, description, price, category, condition, location, image_url, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        title,
        description,
        price,
        category,
        condition,
        location,
        imageUrl,
        createdAt
      ]
    });
    res.status(201).json({
      data: {
        id,
        title,
        description,
        price,
        category,
        condition,
        location,
        image_url: imageUrl,
        created_at: createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing." });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    await db.execute({
      sql: "DELETE FROM listings WHERE id = ?",
      args: [req.params.id]
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
