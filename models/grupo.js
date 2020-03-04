const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const GrupoSchema = new Schema({
  numero: { type: Number, required: true, min: 1, max: 25 },
  nome: { type: String, required: true, maxlength: 9 },
  dezenas: [{ type: Number, required: true, max: 99 }],
  img: { type: String }
});

GrupoSchema.virtual('num').get(function() {
    return this.numero.toString().padStart(2, "0");
});

GrupoSchema.virtual('dez').get(function() {
    return this.dezenas.map(dezena => {
        return dezena.toString().padStart(2, "0");
    })
});

module.exports = mongoose.model('Grupo', GrupoSchema);