/* eslint-disable linebreak-style */
'use strict'

const Cv = require('../modules/cv')
const Router = require('koa-router')
const User = require('../modules/user')
const SeenBy = require('../modules/seenBy')

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
			const cv = await new Cv(dbName)
			const user = await new User(dbName)
			const seen = await new SeenBy(dbName)
			const cvData = await cv.getDataUsingParamsID(ctx.query.toId)
			const userData = await user.getUserUsingID(ctx.session.id)
			await seen.postSeenUsingCvIdAndUsername(cvData.cvId, userData.user)
			return await ctx.render('contact', {data, toId: ctx.query.toId, name: ctx.query.name})
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
router.post('/send-email', async ctx => {
	const user = await new User(dbName)
	const toData = await user.getUserEmailWithUsingId(ctx.query.toId)
	const fromData = await user.getUserEmailWithUsingId(ctx.session.id)
	const isMessageSent = await user.sendEmail(fromData, toData.email, ctx.request.body)
	if (isMessageSent) {
		await ctx.redirect('/', {message: 'Email has been sent!'})
	} else {
		await ctx.redirect('/?msg=email hasn\'t been sent!')
	}
})

module.exports = router.routes()
