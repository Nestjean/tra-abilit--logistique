
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Tester la connexion
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      message: "API fonctionnelle",
      database: "MySQL connecté",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erreur: "Connexion MySQL impossible",
    });
  }
});

// Récupérer les produits
app.get("/api/produits", async (req, res) => {
  try {
    const [produits] = await db.query(
      "SELECT * FROM produits ORDER BY id DESC"
    );

    res.json(produits);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      erreur: "Impossible de récupérer les produits",
    });
  }
});

// Ajouter un produit
app.post("/api/produits", async (req, res) => {
  const { code, nom } = req.body;

  if (
    typeof code !== "string" ||
    typeof nom !== "string" ||
    !code.trim() ||
    !nom.trim()
  ) {
    return res.status(400).json({
      erreur: "Le code et le nom sont obligatoires",
    });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO produits (code, nom) VALUES (?, ?)",
      [code.trim(), nom.trim()]
    );

    res.status(201).json({
      message: "Produit ajouté",
      id: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        erreur: "Ce code produit existe déjà",
      });
    }

    console.error(error);
    res.status(500).json({
      erreur: "Impossible d'ajouter le produit",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend démarré sur le port ${PORT}`);
});
