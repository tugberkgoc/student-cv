'use strict'

const Router = require('koa-router')
const sqLite = require('sqlite-async')
const email = require('../modules/email')

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
	const db = await sqLite.open(dbName)
	const sql1 = `SELECT email FROM users WHERE id=${ctx.session.id};`
	const fromData = await db.get(sql1)
	const sql2 = `SELECT email FROM users WHERE id=${ctx.query.toId};`
	const toData = await db.get(sql2)
	await db.close()

	const data = ctx.request.body
	const mailOption = email.emailSetup(fromData.email, toData.email, data)
	await email.transporter.sendMail(mailOption, err => {
		err ? console.log(err.message) : console.log('Email sent')
	})
	await ctx.redirect('/', {message: 'Email has been sent!'})
})

module.exports = router.routes()
