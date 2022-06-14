import Router from "koa-router";
import * as serviceCtrl from './service.ctrl';

const service = new Router();

service.post('/search', serviceCtrl.search);            // Service Desk 조회
service.post('/request', serviceCtrl.request);          // 등록 요청
service.post('/receipt', serviceCtrl.receipt);          // 접수
// service.post('/process', serviceCtrl.process);        // 처리

export default service;