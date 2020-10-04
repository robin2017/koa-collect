const home = async (ctx)=>{
    await ctx.render('home',{
        title:'koa'
    })
}
module.exports = home