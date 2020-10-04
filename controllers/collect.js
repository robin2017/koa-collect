const fs = require('fs')
const path = require('path')
exports.users = async (ctx) => {
    const { query } = ctx.request
    await fs.writeFileSync('./Log/log.txt', JSON.stringify(query) + '\n', { flag: 'a' })
    //设置响应头
    ctx.set('Content-Type', 'image/gif')
    ctx.body = await fs.readFileSync(path.join(__dirname, '../public/img/loading.gif'))
}
