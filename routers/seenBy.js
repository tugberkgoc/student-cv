'use strict'

const Router = require('koa-router')
//const sqLite = require('sqlite-async')
const seenBy = require('../modules/seenBy')

const router = new Router()



router.get('/', async ctx =>{
    try{
         const seen = await new seenBy()
         const data = ctx.session.authotised
         const user = true
         return await ctx.render('seenBy', {data, user, see: await seen.getSeensUsingID(ctx.session.id), toId: ctx.query.toId})
    }catch(err){
        console.log(err.message)
    }
    await ctx.render('seenBy')

})


module.exports = router.routes()