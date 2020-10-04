const Koa = require('koa');
const childProcess = require('child_process')
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
    const url = `http://localhost:${config.port}`
    console.log(`服务启动，打开网页：${url}`)
    childProcess.exec(`open ${url}`);
});