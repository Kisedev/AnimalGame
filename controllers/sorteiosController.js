const scraper = require("../middlewares/resultsScraper/core");
const async = require("async");

exports.ultimos_resultados = function(req, res, next) {
  console.log('Novas Extrações: ', req.extracoes);
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

exports.banca_resultados = function(req, res, next) {
    scraper({banca: req.params.banca})
        .then(banca_sorteios => {
            res.render('')
        })
        .catch(next)
}