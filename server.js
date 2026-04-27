import express from "express";
import cors from "cors";

import pixRoutes from "./src/routes/pix.routes.js";

const app = express();

// ✅ CORS LIBERADO
app.use(cors({
  origin: "*", // pode restringir depois
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Rotas
app.use("/pix", pixRoutes);

// Health check (IMPORTANTE)
app.get("/", (req, res) => {
  res.send("API PIX ONLINE");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});