import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   CONFIG BASE44
========================= */
const BASE44_API_URL = process.env.BASE44_API_URL;
const BASE44_API_KEY = process.env.BASE44_API_KEY;

/* =========================
   CRIAR PIX
========================= */
app.post("/pix/create", async (req, res) => {
  try {
    const { valor, descricao, movimentacao_id } = req.body;

    if (!valor || !movimentacao_id) {
      return res.status(400).json({
        error: "valor e movimentacao_id são obrigatórios"
      });
    }

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: Number(valor),
        description: descricao || "Pagamento Pix",
        payment_method_id: "pix",

        // 🔥 ESSENCIAL PARA INTEGRAÇÃO
        external_reference: movimentacao_id,

        payer: {
          email: "pagador@email.com"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": Date.now().toString()
        }
      }
    );

    const data = response.data;

    res.json({
      id: data.id,
      qr_code: data.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        data.point_of_interaction.transaction_data.qr_code_base64,
      status: data.status
    });
  } catch (error) {
    console.error("❌ ERRO AO CRIAR PIX:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar Pix" });
  }
});

/* =========================
   CONSULTAR STATUS
========================= */
app.get("/pix/status/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const data = response.data;

    res.json({
      id: data.id,
      status: data.status,
      valor: data.transaction_amount,
      pago_em: data.date_approved
    });
  } catch (error) {
    console.error("❌ ERRO AO CONSULTAR:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao consultar status" });
  }
});

/* =========================
   ATUALIZAR BASE44
========================= */
async function atualizarMovimentacaoBase44(movimentacaoId, payment) {
  try {
    await axios.patch(
      `${BASE44_API_URL}/Movimentacao/${movimentacaoId}`,
      {
        status: "pago",
        valor_pago: payment.transaction_amount,
        data_pagamento: payment.date_approved
      },
      {
        headers: {
          Authorization: `Bearer ${BASE44_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Base44 atualizado:", movimentacaoId);
  } catch (error) {
    console.error(
      "❌ ERRO AO ATUALIZAR BASE44:",
      error.response?.data || error.message
    );
  }
}

/* =========================
   WEBHOOK
========================= */
app.post("/webhook", async (req, res) => {
  try {
    console.log("🔔 Webhook recebido:");
    console.log(req.body);

    const paymentId = req.body?.data?.id || req.body?.resource;

    if (!paymentId) {
      console.log("⚠️ ID não encontrado");
      return res.sendStatus(200);
    }

    // Consulta pagamento real
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const payment = response.data;

    console.log("💰 PAGAMENTO:");
    console.log({
      id: payment.id,
      status: payment.status,
      valor: payment.transaction_amount
    });

    const movimentacaoId = payment.external_reference;

    if (!movimentacaoId) {
      console.log("⚠️ Sem external_reference");
      return res.sendStatus(200);
    }

    // 🔥 Só atualiza quando pago
    if (payment.status === "approved") {
      console.log("✅ PAGAMENTO APROVADO");

      await atualizarMovimentacaoBase44(movimentacaoId, payment);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ ERRO NO WEBHOOK:", error.message);
    res.sendStatus(500);
  }
});

/* =========================
   START
========================= */
app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});