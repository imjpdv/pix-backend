import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pixRoutes from "./routes/pix.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/pix", pixRoutes);

export default app;