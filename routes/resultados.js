const express = require("express");
const router = express.Router();

const Scraper = require("../middlewares/resultsScraper/main");

router.get("/", async function(req, res, next) {
    Scraper(null, null, (erro, ultimos_resultados) => {
        if (erro) {return next(erro)}
        res.render('sorteios', {title: ':: Últimos Resultados ::', resultados: ultimos_resultados});
    });
});

module.exports = router;
