const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const checkUser = require('../middlewares/checkUser');
const userContent = require('../middlewares/userContent');
const fs = require('fs');
const formidable = require('koa-formidable');
const path = require('path');
const moment = require('moment');

//profile
router.get('/personal/:author', async(ctx,next)=>{
//if (ctx.request.querystring) {
    //decodeURIComponent(ctx.request.querystring.split('=')[1]),
    let name = ctx.params.author,
        userInfo;
     let userArr = [];
    await userModel.findDataByName(name)
        .then(result => {
            userInfo = result[0];
           // console.log(ctx.session.info)
        }).catch((err)=>{
            console.log(err);
        })

    await ctx.render('personal',{      
        session:ctx.session,
        userInfo:userInfo,
    })
   
})

//personal infomation sql
router.get('/personalInfo', async(ctx,next)=>{
  console.log(ctx.request.querystring)
   //if(ctx.request.querystring){
       let name = decodeURIComponent(ctx.request.querystring.split('=')[1]);
       let user;
       await userModel.findDataByName(name)
           .then(result => {
               user = result[0];
           }).catch((err)=>{
               console.log(err);
           })
        await ctx.render('personalInformation',{
            session:ctx.session,
            user:user
        })
   
})

//edit user info sql
router.post('/personalInfo',async(ctx,next)=>{
    console.log(ctx.request.body)
    let user = {
        name : ctx.request.body.username,
        job : ctx.request.body.job,
        company : ctx.request.body.company,
        introduce : ctx.request.body.introduce,
        address : ctx.request.body.address,
        github : ctx.request.body.github
    }
    await userModel.updateUser([user.name,user.job,user.company,user.introduce,user.address,user.github,ctx.session.id])
            .then(result=>{
                console.log('edit success')
                ctx.body = 'true';
                ctx.session.user = user.name;
                ctx.session.job = user.job;
                ctx.session.company = user.company;
                ctx.session.introduce = user.introduce;
                ctx.session.address = user.address;
                ctx.session.github = user.github;
            }).catch(err=>{
                console.log(err);
            })
})

//self posts sql
// router.get('/selfArticle/:userId',async(ctx,next)=>{
//     let userId = ctx.params.userId;
//     await userModel.findPostByUserId(userId)
//         .then(result=>{
//                 if(result.length>0){
//                     ctx.body = userContent.updateArticle(result);
//                 }else{
//                     ctx.body = 0;
//                 }
        
//         })
    
// })



module.exports = router