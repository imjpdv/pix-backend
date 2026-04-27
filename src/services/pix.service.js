import axios from "axios";

export async function createPix(valor, descricao) {
  const response = await axios.post(
    "https://api.mercadopago.com/v1/payments",
    {
      transaction_amount: Number(valor),
      description: descricao || "Pagamento Pix",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com"
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

  return response.data;
}

export async function getPixStatus(id) {
  const response = await axios.get(
    `https://api.mercadopago.com/v1/payments/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    }
  );

  return response.data;
}