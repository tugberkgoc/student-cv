'use strict'

const Cv = require('../modules/cv')
const User = require('../modules/user')
const SeenBy = require('../modules/seenBy')
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
		const cv = await new Cv()
		const data = ctx.session.authorised
		const user = true
		await ctx.render('myCV', {data, user, cvData: await cv.getDataUsingUserID(ctx.session.id)})
	} catch (err) {
		ctx.body = err.message
	}
})


router.post('/view/:id', async ctx => { // /view/:id
	try {
			const cv = await new Cv()
			const users = await new User()
			const seen = await new SeenBy() //dbName
			let user = ctx.session.id
			const data = ctx.session.authorised
			const cvData = await cv.getDataUsingParamsID(ctx.params.id)
			const userData = await users.getDataUsersUsingID(user)
			await seen.seenPullData( cvData.cvId, userData.user)
			user = user === cvData
			await ctx.render('myCV', {data, user, cvData, toId: cvData.userID})
			
		
	} catch (err) {
		console.log(err.message)
		//ctx.body = err.message
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
		const {path, name, type} = ctx.request.files.fileToUpload
		await cv.edit(obj)
		await cv.uploadPicture(ctx.session.id, path, name, type)
		await ctx.redirect('/')
	} catch (err) {
		ctx.body = err.message
	}
})

module.exports = router.routes()
