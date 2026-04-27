import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

import createPixRoutes from "./src/routes/pix.routes.js";

const app = express();

// 🔓 CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const PORT = 3000;

// 🔥 INICIAR SERVIDOR COM DB
async function startServer() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  // cria tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id TEXT PRIMARY KEY,
      valor REAL,
      descricao TEXT,
      status TEXT,
      criado_em TEXT,
      pago_em TEXT
    );
  `);

  // rotas
  app.use("/pix", createPixRoutes(db));

  app.get("/", (req, res) => {
    res.send("API PIX ONLINE");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

startServer();