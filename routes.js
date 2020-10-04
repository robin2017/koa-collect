const router = require('koa-router')()
const home = require('./controllers/home')
const task = require('./controllers/task')
const routes = (app)=>{
    //这些URL都是精确匹配，和顺序无关
    router.get('/',home)
    router.get('/users',task.users)
    app.use(router.routes());   /*启动路由*/
    app.use(router.allowedMethods());
}

module.exports = routes