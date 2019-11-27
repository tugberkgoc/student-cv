/* eslint-disable linebreak-style */
'use strict'

const CV = require('../modules/cv')
const Router = require('koa-router')
const seenBy = require('../modules/seenBy')

const router = new Router()
const dbName = 'website.db'

router.get('/', async ctx => {
	try {
		const cv = await new CV(dbName)
		const seen = await new seenBy(dbName)
		const cvObject = await cv.getCVUsingUserID(ctx.session.id)
		return await ctx.render('seenBy', {data: ctx.session.id, see: await seen.getSeenUsingID(cvObject.cvId)})
	} catch (err) {
		console.log(err.message)
	}
	await ctx.render('seenBy')
})

module.exports = router.routes()
