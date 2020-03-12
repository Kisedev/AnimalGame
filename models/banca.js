const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BancaSchema = new Schema({
  nome: { type: String, required: true},
  urn: { type: String, required: true, unique: true},
  sorteios: [{ type: Schema.Types.ObjectId, ref: "Sorteio" }]
});

BancaSchema.virtual('uri').get(function() {
  return `/resultados/${this.urn}`;
})

module.exports = mongoose.model("Banca", BancaSchema);
