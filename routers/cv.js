/* eslint-disable linebreak-style */
'use strict'

const Cv = require('../modules/cv')
const Router = require('koa-router')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})

const router = new Router()
const dbName = 'website.db'

/**
 * @name myCV Page
 * @route {GET} /cv
 */
router.get('/', async ctx => {
	try {
		const cv = await new Cv(dbName)
		const data = ctx.session.authorised
		const user = true
		await ctx.render('my-cv', {data, user, cvData: await cv.getCVUsingUserID(ctx.session.id)})
	} catch (err) {
		ctx.body = err.message
	}
})

router.post('/edit2', koaBody, async ctx => {
	try {
		console.log(ctx.request.body)
		const body = ctx.request.body
		const cv = await new Cv(dbName)
		const obj = await cv.cvObj(ctx.session.id, body)
		await cv.edit2(obj)
		await ctx.redirect('/')
	} catch (err) {
		ctx.body = err.message
	}
})

router.get('/edit2', async ctx => {
	try {
		const data = ctx.session.authorised
		if (data) {
			const cv = await new Cv(dbName)
			const cvData = await cv.cvPull(ctx.session.id)
			return await ctx.render('cv-editorPage2', {data, cvData})
		} else {
			ctx.redirect('/')
		}
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The view specific CV page.
 *
 * @name View CV Page
 * @route {POST} /cv/view/:id
 * @param id: INTEGER
 * @authentication This route requires cookie-based authentication.
 */
router.post('/view/:id', async ctx => {
	try {
		const cv = await new Cv(dbName)
		const sessionUserId = ctx.session.id
		const data = ctx.session.authorised
		const cvData = await cv.getDataUsingParamsID(ctx.params.id)
		await ctx.render('my-cv', {data, user: sessionUserId === cvData.userID, cvData, toId: cvData.userID})
	} catch (err) {
		throw new Error(err)
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
		if (type === 'tif' || type === 'jpeg' || type === 'png') {
			await cv.uploadPicture(ctx.session.id, path, name)
		}
		await ctx.redirect('/cv/edit2')
	} catch (err) {
		ctx.body = err.message
	}
})

module.exports = router.routes()
