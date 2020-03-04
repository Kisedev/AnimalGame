const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SorteioSchema = new Schema({
  banca: { type: Schema.Types.ObjectId, ref: 'Banca', required: true },
  data: { type: Date, required: true, default: Date.now },
  extracao: { type: Schema.Types.ObjectId, ref:'Extracao', required: true },
  premios: [String]
});

SorteioSchema.virtual('uri').get(function() {
  return `/resultado/${this._id}`
})

module.exports = mongoose.model('Sorteio', SorteioSchema);