require("dotenv").config();
import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import client from "./db_connect";
import api from "./api";
import serve from "koa-static";
import path from "path";
import send from "koa-send";
import jwtMiddleware from "./lib/jwtMiddleware";

client.connect((err) => {
    if (err) {
        console.log("Failed to connect db " + err);
    } else {
        console.log("Connect to db done!");
    }
});

const { PORT } = process.env;

const app = new Koa();
const router = new Router();
// // 라우터 설정
router.use("/api", api.routes());

// 라우터 적용 전에 bodyParser 적용
app.use(
    bodyParser({
        formLimit: "50mb",
        jsonLimit: "50mb",
    })
);

app.use(jwtMiddleware);

// check
app.use((ctx, next) => {
    console.log("call check api");

    console.log("예외 항목");
    const accetpUrl = [
        "/api/admin/ctrl_search",
        "/api/admin/code_search",
        "/api/admin/lang_search",
        "/api/admin/company_list",
        "/api/auth/login",
        "/api/auth/register",
    ];

    const {
        request: { url },
    } = ctx;
    console.log(url);

    // 만약 예외 요청이라면 바로 넘어감.
    if (accetpUrl.some((el) => el === url)) {
        console.log("예외 입니다.: ", url);
        return next();
    }

    const { user } = ctx.state;

    console.log(" check user :", user);
    // const now_ip = requestIp.getClientIp(ctx);

    if (!user) {
        // console.log('Not login..');
        ctx.body = "Not login..";
        ctx.status = 401; // Unauthorized
        return;
    }
    // console.log('check..', user);
    ctx.body = user;
    return next();
});

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// PORT가 지정되어 있지 않다면 4000 사용
const port = PORT || 4000;
app.listen(port, "0.0.0.0");
console.log("Listenig to port %d", port);
// app.listen(port, () => {
//     console.log('Listenig to port %d', port);
// });
