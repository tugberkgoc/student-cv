'use strict'

const Router = require('koa-router')
const User = require('../../modules/user')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

const router = new Router()
const dbName = 'website.db'

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 * @name Register Script
 * @route {POST} /register
 */
router.post('/', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)

		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.email, body.pass)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch (err) {
		await ctx.render('register', {message: err.message })
	}
})

module.exports = router.routes()
