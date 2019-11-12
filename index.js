#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const hbs = require('koahub-handlebars')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Cv = require('./modules/cv')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(session(app))
app.use(staticDir('public'))
app.use(logger())
app.use(bodyParser())

app.use(hbs.middleware({
	extname: '.handlebars',
	viewPath: `${__dirname}/views`,
	layoutsPath: `${__dirname}/views/layouts`,
	partialsPath: `${__dirname}/views/partials`
}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
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
		const data = {}
		if(ctx.session.authorised) {
			if (ctx.query.msg) data.msg = ctx.query.msg
			data.isUserLoggedIn = true
			return await ctx.render('index', data)
		} else {
			data.isUserLoggedIn = false
			await ctx.render('index', data)
		}
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})



/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
	// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		// await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

//router.get('/login', async ctx => {
//	const data = {}
//	if (ctx.query.msg) data.msg = ctx.query.msg
//	if (ctx.query.user) data.user = ctx.query.user
//	await ctx.render('login', data)
//})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		return ctx.redirect('/?msg=you are now logged in...')
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

/**
 * The edit CV page.
 *
 * @name Edit Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/cvedit', async ctx => {
	try {
		const data = {}
		if(ctx.session.authorised) {
			if (ctx.query.msg) data.msg = ctx.query.msg
			data.isUserLoggedIn = true
			return await ctx.render('CV_Editor', data)
		} else {
			ctx.redirect('/')
		}
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

router.post('/edit', koaBody, async ctx => {
	try {
		console.log(ctx.request.body)
		const body = ctx.request.body
		const cv = await new Cv(dbName)
		await cv.edit(body.name, body.address, body.summary, body.details)
	} catch(err) {
		ctx.body = err.message
	}
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
