import Router from "koa-router";
import * as adminCtrl from './admin.ctrl';

const admin = new Router();

admin.post('/code_search', adminCtrl.code_search);              // 통합코드 조회
admin.post('/code_register', adminCtrl.code_register);          // 통합코드 등록 및 수정

export default admin;