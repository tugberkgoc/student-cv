/* eslint-disable linebreak-style */
'use strict'

const Cv = require('../modules/cv')
const User = require('../modules/user')
const Router = require('koa-router')

const router = new Router()
const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		new User(dbName)
		const cv = await new Cv(dbName)
		const data = ctx.session.authorised
		const summaryData = await cv.getDataFromCv()
		return await ctx.render('index', {data, cv: summaryData})
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router.routes()
