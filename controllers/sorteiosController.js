const scraper = require("../middlewares/resultsScraper/core");
const async = require("async");

exports.ultimos_resultados = function(req, res, next) {
  scraper({})
    .then(ultimos_sorteios => {
      async.map(ultimos_sorteios, async sorteio => {
          let extracao = await scraper({
            banca: sorteio.banca_urn,
            data: sorteio.data,
            extracao: sorteio.extracao
          });
          return {
            banca: sorteio.banca,
            banca_urn: sorteio.banca_urn,
            data: sorteio.data,
            extracao: sorteio.extracao,
            resultados: extracao.resultados
          };
        })
        .then(ultimas_extracoes => {
            res.render('sorteios', {title: ":: Últimos Resultados ::", resultados: ultimas_extracoes});
        });
    })
    .catch(next);
};
