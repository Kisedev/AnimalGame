const scraper = require("../middlewares/resultsScraper/core");
const async = require("async");
const moment = require("moment");

const Grupo = require('../models/grupo');
const Banca = require('../models/banca');
const Sorteio = require('../models/sorteio');

function formatExtracoes(sorteios) {
  let arraySorteios = [];
  for (let banca in sorteios) {
    sorteios[banca].forEach(xTime => {
      xTime = xTime.split("E");
      arraySorteios.push({
        banca_urn: banca,
        data: moment(Number(xTime[0])).format("DD_MM_YYYY"),
        extracao: xTime[1]
      })
    });
  }
  return arraySorteios;
}

exports.ultimos_resultados = function(req, res, next) {
  // checa se extracoes eh objeto  
  if (Boolean(req.extracoes) && req.extracoes.constructor === Object) {
    // formata data e extracao
    let novosSorteios = formatExtracoes(req.extracoes);
    console.log(novosSorteios.length + ' novos sorteios!');
    // scrap resultados novos sorteios
    async.map(novosSorteios, (sorteio) => {
      resultado = {};
      scraper({banca: sorteio.banca, data: sorteio.data, extracao: sorteio.extracao})
        .then(sorteio => Object.assign(resultado, sorteio))
      return resultado;
    }, (erro, novosResultados) => {
      if(erro) {
        return next();
      }
      // adiciona sorteios no bd
      console.log(novosResultados);
    })
  }

  // aqui pede para o banco de dados os 20 ultimos resultados, de acordo com a pagina requisitada

  // scrap ultimos resultados bd 
  // scraper({})
  //   .then(ultimos_sorteios => {
  //     async.map(ultimos_sorteios, async sorteio => {
  //         let extracao = await scraper({
  //           banca: sorteio.banca_urn,
  //           data: sorteio.data,
  //           extracao: sorteio.extracao
  //         });
  //         return {
  //           banca: sorteio.banca,
  //           banca_urn: sorteio.banca_urn,
  //           data: sorteio.data,
  //           extracao: sorteio.extracao,
  //           resultados: extracao.resultados
  //         };
  //       })
  //       .then(ultimas_extracoes => {
  //           res.render('sorteios', {title: ":: Últimos Resultados ::", resultados: ultimas_extracoes});
  //       });
  //   })
  //   .catch(next);
};

exports.banca_resultados = function(req, res, next) {
  scraper({ banca: req.params.banca })
    .then(banca_sorteios => {
      res.render("");
    })
    .catch(next);
};
