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
const bodyParser = require('koa-bodyparser')

require('dotenv').config()

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

router.use('/', require('./routers/main'))

router.use('/authentication', require('./routers/authentication/login'))

router.use('/register', require('./routers/authentication/signup'))

router.use('/contact', require('./routers/contact'))

router.use('/cv', require('./routers/cv'))

router.use('/about', require('./routers/about'))

router.use('/seenBy', require('./routers/seenBy'))

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
