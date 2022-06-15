import Router from "koa-router";
import * as servicedeskCtrl from './servicedesk.ctrl';

const servicedesk = new Router();

servicedesk.post('/search', servicedeskCtrl.search);            // Service Desk 조회
servicedesk.post('/request', servicedeskCtrl.request);          // 등록 요청
servicedesk.post('/receipt', servicedeskCtrl.receipt);          // 접수
// service.post('/process', serviceCtrl.process);        // 처리

export default servicedesk;