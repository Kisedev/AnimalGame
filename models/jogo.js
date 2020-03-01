const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GrupoSchema = new Schema({
    nome: {type: String, required: true},
    numeros: [Number]
})

const JogoSchema = new Schema({
    grupos: [GrupoSchema],
});

module.exports = mongoose.model('Jogo', JogoSchema);