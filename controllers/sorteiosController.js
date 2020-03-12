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
          console.log('novos resultados', req.sorteios);
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
      async.each(req.sorteios, (sorteio, cb) => {
        Banca.findOne({urn: sorteio.banca_urn}, (erro, banca) => {
          if(erro) { cb(erro)}
          new Sorteio({
            banca: banca._id,
            data: new Date(Number(sorteio.data)),
            extracao: sorteio.extracao,
            resultado: sorteio.resultado
          }).save((erro) => {
            if(erro) {cb(erro)}
          })
        })
      }, (erro) => {
        if (erro) {
          return next(erro);
        }
        console.log(req.sorteios.length + ' novos sorteios adicionados')
        next();
      })
    } else {
      console.log('nenhum sorteio novo')
      next();
    }
  },
  // query ultimos sorteios e render
  function (req, res, next) {
    let queryPage = 0;
    let limit = 10;
    Sorteio.find({})
    .skip(limit*queryPage)
    .sort({data: -1})
    .limit(limit)
    .populate('banca')
    .exec((erro, ultimos_sorteios) => {
      if (erro) { return next(erro) }
      // remapear resultados com numero e nomes grupos
      res.render('sorteios', {title: ":: Últimos Resultados ::", sorteios: ultimos_sorteios});
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
