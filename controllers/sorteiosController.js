const scraper = require("../middlewares/resultsScraper/core");
const async = require("async");
const moment = require("moment");

function formatExtracoes(sorteios) {
  let arraySorteios = [];
  for (let banca in sorteios) {
    sorteios[banca].forEach(xTime => {
      xTime = xTime.split("E");
      arraySorteios.push({
        banca: banca,
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
    // console.log(novosSorteios.length, ' novos sorteios extraidos');
    novosSorteios.forEach(sorteio => console.log(sorteio));
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
      console.log(novosResultados);
    })
    // tentar pegar novos resultados se n chama proximo mid
  } else {
    console.log("Sem novos sorteios");
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
  scraper({ banca: req.params.banca })
    .then(banca_sorteios => {
      res.render("");
    })
    .catch(next);
};
