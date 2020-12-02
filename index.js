const koa = require("koa");   //node框架
const path = require("path");  
const bodyParser = require("koa-bodyparser"); //表单解析中间件
const ejs = require("ejs");   //模板引擎
const session = require("koa-session-minimal");   //处理数据库的中间件
const MysqlStore = require("koa-mysql-session");  //处理数据库的中间件
const router = require("koa-router");     //路由中间件
const config = require('./config/default.js');    //引入默认文件
const views = require("koa-views");   //模板呈现中间件
const koaStatic = require("koa-static");  //静态资源加载中间件
const staticCache = require('koa-static-cache')
const app = new koa();

//session存储配置
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
//login
app.use(require('./routers/signin.js').routes())
//home
app.use(require('./routers/home.js').routes())
//signup
app.use(require('./routers/signup.js').routes())
//profile
app.use(require('./routers/personal').routes())
//articles
app.use(require('./routers/articles.js').routes())
//logout
app.use(require('./routers/signout.js').routes())
//share
app.use(require('./routers/share').routes())
//note
app.use(require('./routers/selfNote').routes())
//监听在8080端口
app.listen(8080) 

console.log(`listening on port ${config.port}`)
