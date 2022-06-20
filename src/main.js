
require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import client from './db_connect';
import api from './api';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';
import jwtMiddleware from './lib/jwtMiddleware';

client.connect(err => { 
    if (err) { 
        console.log('Failed to connect db ' + err); 
    } else { 
        console.log('Connect to db done!'); 
    } 
});

const { PORT } = process.env;

const app = new Koa();
const router = new Router();
// // 라우터 설정
router.use('/api', api.routes());

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser({
    formLimit: "50mb",
    jsonLimit: "50mb"
}));

app.use(jwtMiddleware);

const exceptionUrl = [
    "/api/admin/ctrl_search",
    "/api/admin/code_search",
    "/api/admin/lang_search",
    "/api/admin/company_list",
    "/api/auth/login",
    "/api/auth/register"
];

app.use((ctx, next) => {
    if (exceptionUrl.includes(ctx.request.url)){
        return next();
    } else {
        if (!ctx.state.user) {
            ctx.body = 'Not login..';
            ctx.status = 401;   // Unauthorized
            return;
        } 
        ctx.body = ctx.state.user;
        return next();
    }
});

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// PORT가 지정되어 있지 않다면 4000 사용
const port = PORT || 4000;
app.listen(port, '0.0.0.0');
console.log('Listenig to port %d', port)
// app.listen(port, () => {
//     console.log('Listenig to port %d', port);
// });