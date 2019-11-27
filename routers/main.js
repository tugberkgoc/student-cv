/* eslint-disable linebreak-style */
'use strict'

const Cv = require('../modules/cv')
const User = require('../modules/user')
const Router = require('koa-router')
const sqLite = require('sqlite-async')

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
		new Cv(dbName)
		const data = ctx.session.authorised
		const sql = 'SELECT summary, name, userID, avatarName FROM cv '
		const db = await sqLite.open(dbName)
		const Summary = await db.all(sql)
		await db.close()
		return await ctx.render('index', {data, cv: Summary})
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router.routes()
