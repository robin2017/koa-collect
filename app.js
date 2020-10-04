const Koa = require('koa');
const config = require('./config')
const routes = require('./routes');
const parser = require('./lib/parser')
const render = require('./lib/render')
const static =require('./lib/static')
const app = new Koa();
parser(app)
//render必须让在routes之前
render(app)
routes(app)
static(app)
app.listen(config.port,()=>{
    console.log(`服务启动，打开网页：http://localhost:${config.port}`)
});