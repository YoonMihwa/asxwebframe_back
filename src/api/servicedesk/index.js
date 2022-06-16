import Router from "koa-router";
import * as servicedeskCtrl from './servicedesk.ctrl';

const servicedesk = new Router();

servicedesk.post('/search', servicedeskCtrl.search);            // Service Desk 조회
servicedesk.post('/view', servicedeskCtrl.view);                // 상세조회
servicedesk.post('/request', servicedeskCtrl.request);          // 등록 요청
servicedesk.post('/receipt', servicedeskCtrl.receipt);          // 접수
servicedesk.post('/process', servicedeskCtrl.process);          // 처리
servicedesk.post('/prc_change', servicedeskCtrl.prc_change);    // 담당자변경
servicedesk.post('/evaluation', servicedeskCtrl.evaluation);    // 만족도조사

export default servicedesk;