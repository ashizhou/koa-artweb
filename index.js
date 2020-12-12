const koa = require("koa");   //node framework
const path = require("path");  
const bodyParser = require("koa-bodyparser"); //koa middleware bodyparser
const ejs = require("ejs");   //front framwork ejs
const session = require("koa-session-minimal");   //middleware sql
const MysqlStore = require("koa-mysql-session");  //middleware sql
const router = require("koa-router");     //middleware router
const config = require('./config/default.js');    //引入默认文件
const views = require("koa-views");   //模板呈现中间件
const koaStatic = require("koa-static");  //静态资源加载中间件
const staticCache = require('koa-static-cache')
const multer = require('koa-multer')
const app = new koa();

//session storage
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

//配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))


//配置静态资源加载中间件
app.use(koaStatic(
    path.join(__dirname , './public')
))

//配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'),{
    extension: 'ejs'
}))

//使用表单解析中间件
app.use(bodyParser({
    formLimit:"5mb",
    jsonLimit:"5mb",
    textLimit:"5mb"
}));

//routers
//login+logout+signup
app.use(require('./routers/login.js').routes())
//home
app.use(require('./routers/home.js').routes())
//profile
app.use(require('./routers/personal.js').routes())
//art
app.use(require('./routers/artdetail.js').routes())
//share
app.use(require('./routers/share.js').routes())

//监听在8080端口
app.listen(8080) 

console.log(`listening on port ${config.port}`)
