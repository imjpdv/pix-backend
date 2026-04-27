import express from "express";
import cors from "cors";

import pixRoutes from "./src/routes/pix.routes.js";

const app = express();

// 🔓 CORS LIBERADO (IMPORTANTE para Base44)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// 🧠 Middleware JSON
app.use(express.json());

// 📦 Rotas Pix
app.use("/pix", pixRoutes);

// ❤️ Health check
app.get("/", (req, res) => {
  res.send("API PIX ONLINE");
});

// 🚀 Start servidor (IMPORTANTE: 0.0.0.0)
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});