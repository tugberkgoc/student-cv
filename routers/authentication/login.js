/* eslint-disable linebreak-style */
'use strict'

const Router = require('koa-router')
const User = require('../../modules/user')

const router = new Router()
const dbName = 'website.db'

/**
 * Login to the website.
 *
 * @name Login
 * @route {POST} /authentication/login
 * @authentication This route requires cookie-based authentication.
 */
router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		const id = await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.id = id
		return ctx.redirect('/?msg=you are now logged in...')
	} catch (err) {
		await ctx.render('index', {message: err.message})
	}
})

/**
 * Logout to the website.
 *
 * @name Logout
 * @route {POST} /authentication/logout
 * @authentication This route does not require any cookie-based authentication.
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.id = null
	ctx.redirect('/?msg=you are now logged out')
})

module.exports = router.routes()
