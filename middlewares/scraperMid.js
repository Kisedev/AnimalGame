const fs = require("fs");
const scraper = require("./resultsScraper/core");

const LOCAL_ultimas_extracoes = JSON.parse(
  fs.readFileSync("./data/ultimas_extracoes.json", "utf-8")
);

// Salva e atualiza extracoes localmente para consulta e comparacao
function salvarFeedxTime(dados) {
  // checa se ha a pasta
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }
  fs.writeFileSync(
    "./data/ultimas_extracoes.json",
    JSON.stringify(dados, null, 2)
  );
}
function checaBancas(dados, dados_local) {
  for (let banca in dados) {
    if (!(banca in dados_local)) {
      dados_local[banca] = dados[banca];
    }
  }
  return dados_local;
}
// somente se tiver todas bancas igualmente
function checaExtracoes(dados, dados_local) {
  let novasExtracoes = {};
  for (let banca in dados) {
    if (dados[banca].join("") !== dados_local[banca].join("")) {
      dados[banca].forEach(extracao => {
        if (!dados_local[banca].includes(extracao)) {
          if (!(banca in novasExtracoes)) {
            novasExtracoes[banca] = [];
          }
          novasExtracoes[banca].push(extracao);
        }
      });
    }
  }
  return novasExtracoes;
}
// compara e retorna novas extracoes
function compararExtracoes(dados, dados_local) {
  let novasExtracoes;
  dadosKeys = Object.keys(dados);
  dados_localKeys = Object.keys(dados_local);
  // checa bancas antes das extracoes
  if (dadosKeys.join("") !== dados_localKeys.join("")) {
    // adiciona banca nova ao local
    dados_local = checaBancas(dados, dados_local);
    // mapea novas extracoes
    novasExtracoes = checaExtracoes(dados, dados_local);
  } else {
    // mapea novas extracoes
    novasExtracoes = checaExtracoes(dados, dados_local);
  }
  return novasExtracoes;
}


(() => {
  scraper({ xTimeFeed: true })
    .then(ultimas_extracoes => {
      let novas_extracoes = compararExtracoes(
        ultimas_extracoes,
        LOCAL_ultimas_extracoes
      );
      console.log(novas_extracoes);
      return novas_extracoes;
    })
    // .then((extracoes) => {
    //   passar para req chain do express
    // })
    .catch(console.error);
})();
