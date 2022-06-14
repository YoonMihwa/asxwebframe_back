import Router from "koa-router";
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/login', authCtrl.login);            // 로그인
auth.post('/register', authCtrl.register);      // 회원가입
auth.post('/search', authCtrl.search);          // 사용자 조회

export default auth;