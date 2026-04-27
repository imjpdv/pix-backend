import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id INTEGER PRIMARY KEY,
      valor REAL,
      descricao TEXT,
      status TEXT,
      criado_em TEXT,
      atualizado_em TEXT
    );
  `);

  return db;
}