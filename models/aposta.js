const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApostaSchema = new Schema({
  // usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  banca: { type: Schema.Types.ObjectId, ref: "Banca", required: true },
  premios: [{ type: String, match: /\d{4}\s\(\d{2}\)/ }],
  data: { type: Date, default: Date.now, required: true }
  // opcoes: {
  //   premios: { type: String, required: true, default: "1-5", maxlength: 4 }
  // }
});

module.exports = mongoose.model("Aposta", ApostaSchema);