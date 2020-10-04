const path = require('path')
const views = require('koa-views');
module.exports = (app) => {
    app.use(views(path.join(__dirname, '../views'), { extension: 'ejs' }));
}
