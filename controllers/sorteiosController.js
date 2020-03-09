const scraper = require("../middlewares/resultsScraper/core");
const async = require("async");
const moment = require("moment");

function mapSorteiosxTime(sorteios) {
  for(let banca in sorteios) {
    sorteios[banca] = sorteios[banca].map(xTime => {
      xTime = xTime.split("E");
      return [new Date(Number(xTime[0])), xTime[1]];
    })
  }
  return sorteios;
}
exports.ultimos_resultados = function(req, res, next) {
  // checa se obj esta vazio
  if (!(Object.keys(req.extracoes).length === 0 && req.extracoes.constructor === Object)) {
    // formata data e extracao
    console.log(Object.keys(req.extracoes).length + ' Novos sorteios: ');
    let novosSorteios = mapSorteiosxTime(req.extracoes);
    console.log(novosSorteios);
  } else {
    console.log('Sem novos sorteios')
  }
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
    scraper({banca: req.params.banca})
        .then(banca_sorteios => {
            res.render('')
        })
        .catch(next)
}