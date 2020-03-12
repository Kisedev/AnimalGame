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
      // async.each(req.sorteios, (sorteio) => {
      //   new Sorteio({

      //   })
      // })
      console.log(req.sorteios);
    } else {
      next();
    }
  }
];

// res.render('sorteios', {title: ":: Últimos Resultados ::", resultados: ultimas_extracoes});

exports.banca_resultados = function(req, res, next) {
  scraper({ banca: req.params.banca })
    .then(banca_sorteios => {
      res.render("");
    })
    .catch(next);
};
