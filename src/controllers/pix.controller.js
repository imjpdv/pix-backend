import { createPix, getPixStatus } from "../services/pix.service.js";

export function createPixController() {
  return async (req, res) => {
    try {
      const { valor, descricao } = req.body;

      if (!valor) {
        return res.status(400).json({ error: "Valor é obrigatório" });
      }

      const data = await createPix(valor, descricao);

      res.json({
        id: data.id,
        qr_code: data.point_of_interaction.transaction_data.qr_code,
        qr_code_base64:
          data.point_of_interaction.transaction_data.qr_code_base64,
        status: data.status
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({
        error: "Erro ao criar Pix",
        details: error.response?.data || error.message
      });
    }
  };
}

export async function getPixStatusController(req, res) {
  try {
    const { id } = req.params;

    const data = await getPixStatus(id);

    res.json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      valor: data.transaction_amount
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}