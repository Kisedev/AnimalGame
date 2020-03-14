const mongoose = require("mongoose");
const moment = require('moment');
const Schema = mongoose.Schema;

const mongooseLV = require("mongoose-lean-virtuals");

const PremioSchema = new Schema({
  milhar: { type: String, required: true, maxlength: 4, minlength: 2 },
  grupo: { type: Schema.Types.ObjectId, ref: 'Grupo', required: true }
})

const SorteioSchema = new Schema({
  banca: { type: Schema.Types.ObjectId, ref: 'Banca', required: true },
  data: { type: Date, required: true },
  extracao: { type: String, required: true },
  resultado: [PremioSchema]
});

SorteioSchema.virtual('data_formatada').get(function() {
  return moment(this.data).format('DD/MM/YYYY');
})

SorteioSchema.virtual('uri').get(function() {
  return `/resultado/${this._id}`
})

SorteioSchema.plugin(mongooseLV);

module.exports = mongoose.model('Sorteio', SorteioSchema);