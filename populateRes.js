#! /usr/bin/env node

console.log('Este script escreve as coleções de Grupos e Bancas a database. Database passada como argumento ao node: node populateRes mongodb+srv://nomeUsuarioCluster:senha@cluster0-mbdj7.mongodb.net/databaseNome?retryWrites=true');

// argumentos procedentes a chamada do script
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

const mongoose = require('mongoose');
const async = require('async');

const Grupo = require('./models/grupo');
const Banca = require('./models/banca');

// referenciar colecoes para uso em outras dependentes
var grupos = [];
var bancas = [];

function capitalize(string = "") {
    return string[0].toUpperCase() + string.slice(1);
}
function adicionarGrupo(numero = 0, nome = "", dezenas = [], cb) {
    var grupo = new Grupo({
        numero,
        nome: capitalize(nome),
        dezenas
    });
    grupo.save((erro) => {
        if (erro) {
            return cb(erro);
        }
        console.log('Novo Grupo: ' + grupo)
        grupos.push(grupo);
        cb(null, grupo);
    })
}
function adicionarBanca(nome = "", sigla = "", urn = "", cb) {
    bancaInfo = {
        nome: capitalize(nome),
        urn
    }
    if(sigla) bancaInfo.sigla = sigla.toUpperCase;
    var banca = new Banca(bancaInfo);
    banca.save((erro) => {
        if (erro) {
            return cb(erro);
        }
        console.log('Nova Banca: ' + banca)
        bancas.push(banca);
        cb(null, banca);
    })
}

function criarGrupos(cb) {
    async.series([
        function(callback) {
            adicionarGrupo(1, "avestruz", [1, 2, 3, 4], callback);
        },
        function(callback) {
            adicionarGrupo(2, "águia", [5, 6, 7, 8], callback);
        },
        function(callback) {
            adicionarGrupo(3, "burro", [9, 10, 11, 12], callback);
        },
        function(callback) {
            adicionarGrupo(4, "borboleta", [13, 14, 15, 16], callback);
        },
        function(callback) {
            adicionarGrupo(5, "cachorro", [17, 18, 19, 20], callback);
        },
        function(callback) {
            adicionarGrupo(6, "cabra", [21, 22, 23, 24], callback);
        },
        function(callback) {
            adicionarGrupo(7, "carneiro", [25, 26, 27, 28], callback);
        },
        function(callback) {
            adicionarGrupo(8, "camelo", [29, 30, 31, 32], callback);
        },
        function(callback) {
            adicionarGrupo(9, "cobra", [33, 34, 35, 36], callback);
        },
        function(callback) {
            adicionarGrupo(10, "coelho", [37, 38, 39, 40], callback);
        },
        function(callback) {
            adicionarGrupo(11, "cavalo", [41, 42, 43, 44], callback);
        },
        function(callback) {
            adicionarGrupo(12, "elefante", [45, 46, 47, 48], callback);
        },
        function(callback) {
            adicionarGrupo(13, "galo", [49, 50, 51, 52], callback);
        },
        function(callback) {
            adicionarGrupo(14, "gato", [53, 54, 55, 56], callback);
        },
        function(callback) {
            adicionarGrupo(15, "jacaré", [57, 58, 59, 60], callback);
        },
        function(callback) {
            adicionarGrupo(16, "leão", [61, 62, 63, 64], callback);
        },
        function(callback) {
            adicionarGrupo(17, "macaco", [65, 66, 67, 68], callback);
        },
        function(callback) {
            adicionarGrupo(18, "porco", [69, 70, 71, 72], callback);
        },
        function(callback) {
            adicionarGrupo(19, "pavão", [73, 74, 75, 76], callback);
        },
        function(callback) {
            adicionarGrupo(20, "peru", [77, 78, 79, 80], callback);
        },
        function(callback) {
            adicionarGrupo(21, "touro", [81, 82, 83, 84], callback);
        },
        function(callback) {
            adicionarGrupo(22, "tigre", [85, 86, 87, 88], callback);
        },
        function(callback) {
            adicionarGrupo(23, "urso", [89, 90, 91, 92], callback);
        },
        function(callback) {
            adicionarGrupo(24, "veado", [93, 94, 95, 96], callback);
        },
        function(callback) {
            adicionarGrupo(25, "vaca", [97, 98, 99, 0], callback);
        }
    // callback opcional
    ], cb);
}

function criarBancas(cb) {
    async.series([
        function(callback) {
            adicionarBanca("federal", null, "federal", callback);
        },
        function(callback) {
            adicionarBanca("L-BR", null, "l_br", callback);
        },
        function(callback) {
            adicionarBanca("lotep", "pb", "lotep", callback);
        },
        function(callback) {
            adicionarBanca("Rio Grande do Sul", null, "rio_grande_do_sul", callback);
        },
        function(callback) {
            adicionarBanca("São Paulo", null, "sao_paulo", callback);
        },
        function(callback) {
            adicionarBanca("lotece", null, "lotece", callback);
        },
        function(callback) {
            adicionarBanca("look", "go", "look", callback);
        },
        function(callback) {
            adicionarBanca("Bahia", null, "bahia", callback);
        },
        function(callback) {
            adicionarBanca("Bahia - Maluca", null, "bahia_maluca", callback);
        },
        function(callback) {
            adicionarBanca("popular Recife", null, "popular_recife", callback);
        },
        function(callback) {
            adicionarBanca("loteria Nacional", null, "loteria_nacional", callback);
        },
        function(callback) {
            adicionarBanca("Minas Gerais", null, "minas_gerais", callback);
        },
        function(callback) {
            adicionarBanca("Rio de Janeiro", null, "rio_de_janeiro", callback);
        }
    ], cb)
}

async.series([
    criarGrupos,
    criarBancas
], function(erro, resultados) {
    if (erro) { 
        console.log('ERRO FINAL: '+erro)
    } else {
        console.log(`${grupos.length}/25 grupos adicionados`)
        console.log(`${bancas.length} bancas adicionados`)
    }
    // Tudo feito encerra conexao ao cluster
    mongoose.connection.close();
}
)