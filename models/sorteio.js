const mongoose = require("mongoose");
const moment = require('moment');
const Schema = mongoose.Schema;

const SorteioSchema = new Schema({
  banca: { type: Schema.Types.ObjectId, ref: 'Banca', required: true },
  data: { type: Date, required: true },
  extracao: { type: String, required: true },
  resultado: [String]
});

SorteioSchema.virtual('data_formatada').get(function() {
  return moment(this.data).format('DD/MM/YYYY');
})

SorteioSchema.virtual('uri').get(function() {
  return `/resultado/${this._id}`
})

module.exports = mongoose.model('Sorteio', SorteioSchema);