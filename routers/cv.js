'use strict'

const Cv = require('../modules/cv')
const Router = require('koa-router')
const sqLite = require('sqlite-async')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

const router = new Router()
const dbName = 'website.db'

/**
 * @name myCV Page
 * @route {GET} /cv
 */
router.get('/', async ctx => {
	try {
		const data = ctx.session.authorised
		const sql = `SELECT * FROM cv WHERE userID = "${ctx.session.id}";`
		const db = await sqLite.open(dbName)
		const cvData = await db.get(sql)
		await db.close()
		const user = true
		await ctx.render('myCV', {data, user,cvData})
	} catch (err) {
		ctx.body = err.message
	}
})

router.get('/view/:id', async ctx => {
	try {
		const data = ctx.session.authorised
		let user = ctx.session.id
		const sql = `SELECT * FROM cv WHERE userID = "${ctx.params.id}";`
		const db = await sqLite.open(dbName)
		const cvData = await db.get(sql)
		await db.close()
		if(user===cvData.userID) {
			user=true
		} else {
			user=false
		}
		await ctx.render('myCV', {data, user, cvData})
	} catch (err) {
		ctx.body = err.message
	}
})

/**
 * The edit CV page.
 *
 * @name Edit Page
 * @route {GET} /cv/edit
 * @authentication This route requires cookie-based authentication.
 */
router.get('/edit', async ctx => {
	try {
		const data = ctx.session.authorised
		if (data) {
			const cv = await new Cv(dbName)
			const cvData = await cv.cvPull(ctx.session.id)
			return await ctx.render('CV_Editor', {data, cvData})
		} else {
			ctx.redirect('/')
		}
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The edit CV page.
 *
 * @name Edit Page
 * @route {POST} /cv/edit
 */
router.post('/edit', koaBody, async ctx => {
	try {
		console.log(ctx.request.body)
		const body = ctx.request.body
		const cv = await new Cv(dbName)
		const obj = await cv.cvObj(ctx.session.id, body)
		await cv.edit(obj)
		await ctx.redirect('/')
	} catch (err) {
		ctx.body = err.message
	}
})

module.exports = router.routes()
