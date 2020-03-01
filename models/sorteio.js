const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApostaSchema = new Schema({
  banca: { type: Schema.Types.ObjectId, ref: 'Banca', required: true },
  premios: [String],
  data: { type: Date, required: true },
});

BancaSchema.virtual('hora').get(function() {
    return `Horario do resultado previsto || urn resultado`;
})

ApostaSchema.virtual('pre')