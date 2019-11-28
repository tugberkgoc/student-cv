/* eslint-disable linebreak-style */
'use strict'

const Cv = require('../modules/cv')
const Router = require('koa-router')

const router = new Router()
const dbName = 'website.db'

router.post('/', async ctx => {
	try {
		const data = ctx.session.authorised
		console.log('test')
		const cvName = ctx.request.body.q
		console.log(ctx.query.q)
		const cv = await new Cv(dbName)
		const searchData = await cv.search(cvName)
		console.log(searchData)
		return await ctx.render('result', {data,result: searchData, query: cvName})
	} catch (err) {
		console.log(err.message)
	}
})

module.exports = router.routes()
