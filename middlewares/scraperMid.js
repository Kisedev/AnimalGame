const fs = require("fs");
const path = require("path");
const scraper = require(path.join(__dirname, "resultsScraper/core"));
const LOCAL_ultimas_extracoes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/ultimas_extracoes.json"), "utf-8")
);
const SCRAPER_ultimas_extracoes = {};

// Salva e atualiza extracoes localmente para consulta e comparacao
function salvarFeedxTime(dados) {
  // checa se ha a pasta
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }
  fs.writeFileSync(
    path.join(__dirname, "data/ultimas_extracoes.json"),
    JSON.stringify(dados, null, 2)
  );
}

function checaBancasExtracoes(dados, dados_local) {
  let novas_extracoes = {};
  for (let banca_urn in dados) {
    // se nao tiver a banca urn local adicione com todas extracoes
    if (!(banca_urn in dados_local)) {
      novas_extracoes[banca_urn] = dados[banca_urn];
      dados_local[banca_urn] = dados[banca_urn];
    } else if (dados[banca_urn].join("") !== dados_local[banca_urn].join("")) {
      dados[banca_urn].forEach(extracao => {
        // se nao tiver a extracao na ocorrencia da banca repasse a nova
        if (!dados_local[banca_urn].includes(extracao)) {
          novas_extracoes[banca_urn].push(extracao);
        }
      });
    }
  }
  return novas_extracoes;
}
function checaExtracoes(dados, dados_local) {
  let novas_extracoes = {};
  for (let banca_urn in dados) {
    if (dados[banca_urn].join("") !== dados_local[banca_urn].join("")) {
      dados[banca_urn].forEach(extracao => {
        // se nao tiver a extracao na ocorrencia da banca repasse a nova
        if (!dados_local[banca_urn].includes(extracao)) {
          novas_extracoes[banca_urn].push(extracao);
        }
      });
    }
  }

}

// compara e retorna novas extracoes
function compararExtracoes(dados, dados_local) {
  let novasExtracoes;
  dadosKeys = Object.keys(dados);
  dados_localKeys = Object.keys(dados_local);
  // checa bancas antes das extracoes
  if (dadosKeys.join("") !== dados_localKeys.join("")) {
    // adiciona banca nova ao local
    novasExtracoes = checaBancasExtracoes(dados, dados_local);
  } else {
    // mapea novas extracoes
    novasExtracoes = checaExtracoes(dados, dados_local);
  }
  return novasExtracoes;
}

module.exports = function(req, res, next) {
  req.extracoes = null;
  scraper({ xTimeFeed: true })
    .then(ultimas_extracoes => {
      Object.assign(SCRAPER_ultimas_extracoes, ultimas_extracoes);
      let novas_extracoes = compararExtracoes(
        SCRAPER_ultimas_extracoes,
        LOCAL_ultimas_extracoes
      );

      if (Object.keys(novas_extracoes).length !== 0) {
        // atualiza extracoes local
        salvarFeedxTime(SCRAPER_ultimas_extracoes);
        req.extracoes = novas_extracoes;
      }
      next();
    })
    .catch((erro) => {
      console.error(erro);
      next();
    })
}

// scraper({ xTimeFeed: true })
//   .then(ultimas_extracoes => {
//     Object.assign(SCRAPER_ultimas_extracoes, ultimas_extracoes);
//     let novas_extracoes = compararExtracoes(
//       SCRAPER_ultimas_extracoes,
//       LOCAL_ultimas_extracoes
//     );
//     console.log(novas_extracoes);
//     if (Object.keys(novas_extracoes).length !== 0) {
//       // atualiza extracoes local
//       salvarFeedxTime(SCRAPER_ultimas_extracoes);
//     }
//   })
//   .catch(console.error);
