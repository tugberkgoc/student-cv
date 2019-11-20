#!/usr/bin/env node

// Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const session = require('koa-session')
const staticDir = require('koa-static')
const hbs = require('koahub-handlebars')
<<<<<<< HEAD
///-----------------------------////////
const path = require("path");
const mime = require("mime-types")

////////////////////////
const nodemailer = require('nodemailer')
require('dotenv').config();
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Cv = require('./modules/cv')
//---------//
const email = require('./modules/email')
=======
const bodyParser = require('koa-bodyparser')

require('dotenv').config()
>>>>>>> 3febb26a6690fb22252341f769946bd3b2de74be

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
<<<<<<< HEAD
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
		const data = ctx.session.authorised
		//line for if database is deleted
		const cv=new Cv(dbName)
		const sql = `SELECT summary, name FROM cv `
		const db = await sqlite.open(dbName)
		const Summary = await db.all(sql)
		await db.close()
		return await ctx.render('index', {data, cv: Summary})
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
 * @name index
 * @route {GET} /index
 */

router.get('/index', async ctx => await ctx.render('index'))
/** 
 * @name myCV Page
 * @route {GET} /myCV
 */
router.get('/myCV', async ctx => {
	try {
		const data = ctx.session.authorised
		const sql = `SELECT * FROM cv WHERE userID = "${ctx.session.id}";`
		const db = await sqlite.open(dbName)
		const cvData = await db.get(sql)
		await db.close()
		await ctx.render('myCV', {data, cvData})
	} catch(err) {
		ctx.body = err.message
	}
})
/**
 * The script to process new user registrations.
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
	// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		const {path, type} = ctx.request.files.fileToUpload
		console.log(path)
		console.log(type)
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.email, body.pass)
		await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
});







////----------------------------------------///
/**
 * @name Contact 
 * @route {get}
 */
router.get('/contact', async ctx => { 
	try {
		const data = ctx.session.authorised
		if(data) {
			return await ctx.render('contact', {data})
		} else {
			ctx.redirect('/')
		}
	}catch(err) {
		console.log(err)
	}
	await ctx.render('contact')
		});	


router.post('/direct', async ctx =>{
	try{
		ctx.session.authorised = true
		const data = ctx.session.authorised
		if(data){
			return await ctx.render("contact", data)
		} else {
			ctx.redirect("/")
		}
	}catch (err) {
		console.log(err.message)
	}
})

/**
 * @name Contact 
 * @route {post} /send
 * 
 */
router.post('/send', async ctx => {
	const data = ctx.request.body
	const mailOption=email.emailSetup(ctx.request.body.email,ctx.request.body.emailTo,data)
	email.transporter.sendMail(mailOption, (err) =>{   //err, data
	  if(err) {
		  console.log(err.message)
	  }else{
		  console.log("Email sent")  
	  }
	})
	await ctx.render('contact',{message: 'Email has been sent!'});
});
	

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		const id = await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.id = id
		return ctx.redirect('/?msg=you are now logged in...')
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.id = null
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
		const data = ctx.session.authorised
		if(data) {
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

router.post('/edit', koaBody, async ctx => {
	try {
		console.log(ctx.request.body)
		const body = ctx.request.body
		const cv = await new Cv(dbName)
		const obj =await cv.cvObj(ctx.session.id, body)
		await cv.edit(obj)
		await ctx.redirect("/")
	} catch(err) {
		ctx.body = err.message
	}
});
=======

router.use('/', require('./routers/main'))

router.use('/authentication', require('./routers/authentication/login'))

router.use('/register', require('./routers/authentication/signup'))

router.use('/contact', require('./routers/contact'))

router.use('/cv', require('./routers/cv'))
>>>>>>> 3febb26a6690fb22252341f769946bd3b2de74be

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))


