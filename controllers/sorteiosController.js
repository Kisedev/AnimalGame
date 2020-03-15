const scraper = require('../middlewares/resultsScraper/core')
const async = require('async')
const moment = require('moment')

const Grupo = require('../models/grupo')
const Banca = require('../models/banca')
const Sorteio = require('../models/sorteio')

exports.ultimos_resultados = function(req, res, next) {
	let queryPage = 0;
	let limit = 10;
	if (Boolean(req.extracoes) && req.extracoes.constructor === Array) {
		// se tiver novas extracoes executa este fluxo
		async.map(req.extracoes, async (sorteio) => {
			return await scraper({
				banca: sorteio.banca_urn,
				data: sorteio.data,
				extracao: sorteio.extracao
			})
		}).then(novosSorteios => {
			// map sorteios com documentos
			console.log('novos ' + novosSorteios.length);
			async.parallel({
				bancas: function(callback) {
					Banca.find({})
					.lean()
					.exec(callback)
				},
				grupos: function(callback) {
					Grupo.find({})
					.lean({ virtuals: true })
					.exec(callback)
				}
			}, function(erro, resultados) {
				if (erro) {
					reject(erro);
					return;
				}
				novosSorteios = novosSorteios.map(function(sorteio) {
					return {
						banca: resultados.bancas.filter((banca) => {
							return banca.urn === sorteio.banca_urn
						})[0]._id,
						data: new Date(Number(sorteio.data)),
						extracao: sorteio.extracao,
						resultado: sorteio.resultado.map((premio) => {
							premio.grupo = resultados.grupos.filter((grupo) => {
								return grupo.numero === premio.grupo
							})[0]._id
							return premio
						})
					}
				});
				console.log('remaped ' + novosSorteios.length);
				async.each(novosSorteios, (sorteio, cb) => {
					sorteio = new Sorteio(sorteio).save((erro, sorteioSalvo) => {
						if (erro) {return cb(erro)}
						console.log('Sorteio salvo ' + sorteioSalvo._id)
					});
				}, (erro) => {
					if (erro) {
						return next(erro)
					}
				})
			});
		})
		.catch(next)
		.finally(() => {
			Sorteio.find({})
			.sort({data: -1})
			.lean({ virtuals: true })
			.skip(limit * queryPage)
			.limit(limit)
			.populate('banca')
			.populate({
				path: 'resultado.grupo',
				model: 'Grupo'
			})
			.exec((erro, ultimosSorteios) => {
				if (erro) {
					return next(erro)
				}
				res.render('sorteios', {title: ':: Últimos Resultados ::', sorteios: ultimosSorteios});
			});
		})
	} else {
		// se não somente busca os resultados e renderiza pagina
		Sorteio.find({})
		.sort({data: -1})
		.lean({ virtuals: true })
		.skip(limit * queryPage)
		.limit(limit)
		.populate('banca')
		.populate({
			path: 'resultado.grupo',
			model: 'Grupo'
		})
		.exec((erro, ultimosSorteios) => {
			if (erro) {
				return next(erro)
			}
			res.render('sorteios', {title: ':: Últimos Resultados ::', sorteios: ultimosSorteios});
		});
	}
}

exports.banca_resultados = function(req, res, next) {
	scraper({ banca: req.params.banca })
		.then((banca_sorteios) => {
			res.render('')
		})
		.catch(next)
}
