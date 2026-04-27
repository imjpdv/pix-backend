import QRCode from "qrcode";
import fs from "fs";

// 👇 COLE SEU CÓDIGO PIX AQUI
const pixCode = `00020126360014br.gov.bcb.pix011447548978000156520400005303986540510.005802BR5906IMJPDV6009Sao Paulo622505`;

// gerar imagem
QRCode.toFile("pix.png", pixCode, {
  type: "png",
  width: 300
})
  .then(() => {
    console.log("QR Code gerado: pix.png");
  })
  .catch((err) => {
    console.error("Erro:", err);
  });