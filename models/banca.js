const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BancaSchema = new Schema({
  nome: { type: String, required: true, unique: true},
  urn: { type: String, required: true},
  sigla: { type: String},
  sorteios: [{ type: Schema.Types.ObjectId, ref: "Sorteio" }]
});

BancaSchema.virtual('uri').get(function() {
  return (this.sigla) ? `/resultados/${this.urn}` : `/resultados/${this.urn}_${this.sigla.toLowerCase()}`
})

// BancaSchema.virtual('hora').get(function() {
//   return `Próxima Extração`;
// })

module.exports = mongoose.model("Banca", BancaSchema);
