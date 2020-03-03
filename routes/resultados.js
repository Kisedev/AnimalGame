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
  let dataHoje = new Date();
  dataHoje = moment(dataHoje).format("DD_MM_YYYY");
  Scraper(req.params.banca, dataHoje, (erro, resultados_hoje) => {
    if (erro) {
      return next(erro);
    }
    res.render("sorteios_banca", {
      title: ":: Hoje ::",
      resultados: resultados_hoje
    });
  });
});

router.get("/:banca/:dia", function(req, res, next) {
  Scraper(req.params.banca, req.params.dia, (erro, resultados_dia) => {
    if (erro) {
      return next(erro);
    }
    res.render("sorteios_banca", {
      title: `:: ${req.params.dia} ::`,
      resultados: resultados_dia
    });
  });
});

module.exports = router;
