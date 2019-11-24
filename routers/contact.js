'use strict'

const Router = require('koa-router')
const email = require('../modules/email')
const sqlite = require('sqlite-async')

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
			return await ctx.render('contact', {data})
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
	const body = ctx.request.body
	const sql = `SELECT email FROM users WHERE id ="${ctx.session.id}"`
	const db = await sqlite.open(dbName)
	const emailData = await db.get(sql)
	await db.close()
	console.log(emailData)
	const mailOption = email.emailSetup(emailData,body.emailTo, body) // ctx.request.body.email
	email.transporter.sendMail(mailOption, err => {
		if (err) {
			console.log(err.message)
		} else {
			console.log('Email sent')
		}
	})
	await ctx.redirect('/', {message: 'Email has been sent!'})
	// await ctx.render('/contact', {message: 'Email has been sent!'})
	// Tugberk : I broke it, sorry, we will fix it later
})

module.exports = router.routes()
