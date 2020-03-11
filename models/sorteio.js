const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SorteioSchema = new Schema({
  banca: { type: Schema.Types.ObjectId, ref: 'Banca', required: true },
  data: { type: Date, required: true, default: Date.now },
  extracao: { type: String, required: true, match: /\d{2}:|_\d{2}/ },
  premios: [String]
});

SorteioSchema.virtual('uri').get(function() {
  return `/resultado/${this._id}`
})

module.exports = mongoose.model('Sorteio', SorteioSchema);