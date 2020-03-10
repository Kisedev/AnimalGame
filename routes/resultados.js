const express = require("express");
const router = express.Router();

const sorteiosCntl = require('../controllers/sorteiosController');

const Scraper = require("../middlewares/resultsScraper/core");

router.get("/", sorteiosCntl.ultimos_resultados);

router.get("/:banca", function(req, res, next) {
  Scraper(req.params.banca, null, (erro, resultados_hoje) => {
    if (erro) {
      return next(erro);
    }
    let banca = resultados_hoje.extracoes.length > 0 ? resultados_hoje.extracoes[0].banca : req.params.banca;
    res.render("sorteios_banca", {
      title: `Capital do Bicho - ${banca}`,
      data: resultados_hoje.data,
      banca: banca,
      resultados: resultados_hoje.extracoes
    });
  });
});

router.get("/:banca/:dia", function(req, res, next) {
  Scraper(req.params.banca, req.params.dia, (erro, resultados_dia) => {
    if (erro) {
      return next(erro);
    }
    let banca = resultados_dia.length > 0 ? resultados_hoje[0].banca : req.params.banca;
    res.render("sorteios_banca", {
      title: `:: ${data} ::`,
      data: resultados_dia.data,
      banca: banca,
      resultados: resultados_dia
    })
  })
})

module.exports = router;
