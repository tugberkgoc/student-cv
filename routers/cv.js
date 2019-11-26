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
		await ctx.render('my-cv', {data, user, cvData})
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
		user = user === cvData.userID
		await ctx.render('my-cv', {data, user, cvData, toId: cvData.userID})
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
			return await ctx.render('cv-editor', {data, cvData})
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
		const {path, name, type} = ctx.request.files.fileToUpload
		await cv.edit(obj)
		if(type==='bin') {
			console.log(path,name,type)
			await cv.uploadPicture(ctx.session.id, path, name, type)
		}
		await ctx.redirect('/')
	} catch (err) {
		ctx.body = err.message
	}
})

module.exports = router.routes()
