import Router from "koa-router";
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/login', authCtrl.login);            // 로그인
auth.post('/register', authCtrl.register);      // 회원가입

export default auth;