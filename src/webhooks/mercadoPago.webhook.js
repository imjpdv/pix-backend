import { getPixStatus } from "../services/pix.service.js";

export function mercadoPagoWebhook(db) {
  return async (req, res) => {
    try {
      const { type, data } = req.body;

      if (type !== "payment") {
        return res.sendStatus(200);
      }

      const paymentId = data.id;

      const pagamento = await getPixStatus(paymentId);

      await db.run(
        `
        UPDATE pagamentos
        SET status = ?, atualizado_em = datetime('now')
        WHERE id = ?
      `,
        [pagamento.status, paymentId]
      );

      console.log("Webhook recebido:", paymentId, pagamento.status);

      res.sendStatus(200);
    } catch (error) {
      console.error("Erro webhook:", error.message);
      res.sendStatus(500);
    }
  };
}