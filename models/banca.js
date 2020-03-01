const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BancaSchema = new Schema({
  nome: { type: String, required: true, unique: true},
  sigla: { type: String, unique: true},
  urn: { type: String, required: true, unique: true },
  sorteios: [{ type: Schema.Types.ObjectId, ref: "Sorteio" }]
});

module.exports = mongoose.model("Banca", BancaSchema);
