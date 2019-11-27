'use strict'

const Router = require('koa-router')

const router = new Router()
const dbName = 'website.db'

/**
 * @name Contact
 * @route {get} /contact/
 */
router.get('/', async ctx => {
	try {
		return await ctx.render('about', {data: ctx.session.authorised})
	} catch (err) {
		console.log(err)
	}
	await ctx.render('contact')
})

module.exports = router.routes()
