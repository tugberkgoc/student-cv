'use strict'

const Router = require('koa-router')
const Email = require('../modules/email')


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
	const email = await new Email()

	const fromData = await email.getDataForSender(ctx.session.id)
	const toData = await email.getDataForReciever(ctx.query.toId)
	const transporter = await email.transporter()


	const data = ctx.request.body
	const mailOption = email.emailSetup(fromData.email, toData.email, data)
	await transporter.sendMail(mailOption, err => {
		err ? console.log(err.message) : console.log('Email sent')
	})
	await ctx.redirect('/', {message: 'Email has been sent!'})
})

module.exports = router.routes()
