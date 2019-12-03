/* eslint-disable linebreak-style */
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
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.register(body.user, body.email,body.phoneNumber, body.pass)
		ctx.redirect(`/?msg=new user "${body.user}" added`)
	} catch (err) {
		await ctx.render('register', {message: err.message })
	}
})

module.exports = router.routes()
