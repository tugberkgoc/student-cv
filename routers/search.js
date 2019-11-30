'use strict'

const Cv = require('../modules/cv')
const Router = require('koa-router')

const router = new Router()
const dbName = 'website.db'

router.post('/', async ctx => {
	try {
		const data = ctx.session.authorised
		const cvName = ctx.request.body.q
		const cv = await new Cv(dbName)
		const searchData = await cv.search(cvName)
		return await ctx.render('result', {data, result: searchData, query: cvName})
	} catch (err) {
		throw err
	}
})

module.exports = router.routes()
