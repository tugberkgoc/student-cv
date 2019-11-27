'use strict'

const Router = require('koa-router')
const User = require('../modules/user')

const router = new Router()
const dbName = 'website.db'

/**
 * @name Contact
 * @route {get} /contact/
 */
router.get('/', async ctx => {
	try {
		const data = ctx.session.authorised
		if (data) {
			return await ctx.render('contact', {data, toId: ctx.query.toId})
		} else {
			ctx.redirect('/')
		}
	} catch (err) {
		console.log(err)
	}
	await ctx.render('contact')
})

/**
 * @name Contact
 * @route {post} /contact/send-email
 */
// eslint-disable-next-line max-lines-per-function
router.post('/send-email', async ctx => {
	const user = await new User(dbName)
	const toData = await user.getUserEmailWithUsingId(ctx.query.toId)
	const fromData = await user.getUserEmailWithUsingId(ctx.session.id)
	const isMessageSent = await user.sendEmail(fromData.email, toData.email, ctx.request.body)
	if (isMessageSent) {
		await ctx.redirect('/', {message: 'Email has been sent!'})
	} else {
		await ctx.redirect('/?msg=email hasn\'t been sent!')
	}
})

module.exports = router.routes()
