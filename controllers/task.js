const fs = require('fs')
exports.users = async (ctx) => {
 
    const { query } = ctx.request
    fs.writeFile('./Log/log.txt', JSON.stringify(query) + '\n', { flag: 'a' },function(){})
    ctx.body = [
        { name: 'bota' },
        { name: 'robin' }
    ]
}
