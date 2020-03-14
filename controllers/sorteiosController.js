const scraper = require("../middlewares/resultsScraper/core");
const async = require("async");
const moment = require("moment");

const Grupo = require("../models/grupo");
const Banca = require("../models/banca");
const Sorteio = require("../models/sorteio");

exports.ultimos_resultados = [
  // trata novas extracoes
  function(req, res, next) {
    // checa se extracoes eh objeto
    if (Boolean(req.extracoes) && req.extracoes.constructor === Array) {
      // scrap resultados novos sorteios
      async.map(
        req.extracoes,
        async sorteio => {
          return await scraper({
            banca: sorteio.banca_urn,
            data: sorteio.data,
            extracao: sorteio.extracao
          });
        },
        (erro, novosResultados) => {
          if (erro) {
            return next();
          }
          // devolve ao req extracoes com resultados
          req.sorteios = novosResultados;
          next();
        }
      );
    } else {
      req.sorteios = null;
      next();
    }
  },
  // adiciona novos sorteios ao bd
  function(req, res, next) {
    if (Boolean(req.sorteios) && req.sorteios.constructor === Array) {
      // async parallel bancas, grupos (lean) > map sorteio banca id > map resultado grupo + async each sorteio save bd
      async.parallel({
        bancas: function(callback) {
          Banca.find({}).lean().exec(callback);
        },
        grupos: function(callback) {
          Grupo.find({}).lean().exec(callback);
        }
      }, (erro, resultados) => {
        if (erro) {return erro}
        let Sorteios = req.sorteios.map(function(sorteio) {
          return {
            // find banca id in bancas
            banca: resultados.bancas.filter(banca => {return banca.urn === sorteio.banca_urn})[0]._id,
            data: new Date(Number(sorteio.data)),
            extracao: sorteio.extracao,
            // find grupo id in grupos
            resultado: sorteio.resultado.map(premio => {
              premio.grupo = resultados.grupos.filter(grupo => {return grupo.numero === premio.grupo})[0]._id
            })
          }
        })
        async.each(Sorteios, (sorteio, cb) => {
          // save in bd
          new Sorteio(sorteio).save((erro) => { if(erro) {cb(erro)} })
        }, (erro) => {
          if(erro) {return next(erro)}
          console.log(Sorteios.length + ' sorteios adicionados')
          next();
        })
      });
    } else {
      console.log('nenhum sorteio novo')
      next();
    }
  },
  // query ultimos sorteios e render
  function (req, res, next) {
    async.parallel({
      grupos: function(callback) {
        Grupo.find({})
        .lean({ virtuals: true })
        .exec(callback);
      },
      sorteios: function(callback) {
        let queryPage = 0;
        let limit = 10;
        // se nao match para extracao hora entao buscar e fixar em secao diaria 
        Sorteio.find({})
        .lean({ virtuals: true })
        .sort("-data")
        .skip(limit*queryPage)
        .limit(limit)
        .populate('banca')
        .exec(callback);
      }
    }, (erro, resultados) => {
      if(erro) {
        return next(erro)
      }
      res.render('sorteios', {title: ":: Últimos Resultados ::", grupos: resultados.grupos, sorteios: resultados.sorteios});
    })
  }
];


exports.banca_resultados = function(req, res, next) {
  scraper({ banca: req.params.banca })
    .then(banca_sorteios => {
      res.render("");
    })
    .catch(next);
};
