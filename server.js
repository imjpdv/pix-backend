import express from "express";
import cors from "cors";

import createPixRoutes from "./src/routes/pix.routes.js";

const app = express();

// CORS liberado (para Base44 funcionar)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Rotas Pix
app.use("/pix", createPixRoutes());

// Health check
app.get("/", (req, res) => {
  res.send("API PIX ONLINE");
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});