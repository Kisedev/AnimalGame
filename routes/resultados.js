const express = require("express");
const router = express.Router();

const moment = require("moment");
const Scraper = require("../middlewares/resultsScraper/main");

router.get("/", async function(req, res, next) {
  Scraper(null, null, (erro, ultimos_resultados) => {
    if (erro) {
      return next(erro);
    }
    res.render("sorteios", {
      title: ":: Últimos Resultados ::",
      resultados: ultimos_resultados
    });
  });
});

router.get("/:banca", function(req, res, next) {
  Scraper(req.params.banca, dataHoje, (erro, resultados_hoje) => {
    if (erro) {
      return next(erro);
    }
    let banca = resultados_hoje.length > 0 ? resultados_hoje[0].banca : req.params.banca;
    res.render("sorteios_banca", {
      title: ":: Hoje ::",
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
    });
  });
});

module.exports = router;
