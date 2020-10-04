const path = require('path')
//配合router一起使用，必须用koa-static-router
const static = require('koa-static-router');
const dir = './public'
const router = '/static/'
module.exports = (app) => {
    app.use(static({ dir, router }))
}
