import Router from "koa-router";
import * as adminCtrl from './admin.ctrl';

const admin = new Router();

admin.post('/class_search', adminCtrl.class_search);            // 메인 통합코드 조회 ROOT
admin.post('/code_search', adminCtrl.code_search);              // 통합코드 조회
admin.get('/company_list', adminCtrl.company_list);             // 회사코드 조회
admin.post('/code_register', adminCtrl.code_register);          // 통합코드 등록 및 수정
admin.post('/comcode_register', adminCtrl.comcode_register);    // 회사별 통합코드 등록 및 수정
admin.post('/tempcd_update', adminCtrl.tempcd_update);          // temp_code update

admin.post('/pgm_register', adminCtrl.pgm_register);            // 프로그램 등록
admin.post('/pgm_list', adminCtrl.pgm_list);                    // 프로그램 조회

admin.post('/lang_register', adminCtrl.lang_register);          // Language 등록
admin.post('/lang_search', adminCtrl.lang_search);              // Language 조회

admin.post('/grid_register', adminCtrl.grid_register);          // Grid 등록
admin.post('/grid_items', adminCtrl.grid_items);                // Grid 상세 item 등록
admin.get('/grid_list', adminCtrl.grid_list);                   // Grid 조회
admin.post('/grid_item_view', adminCtrl.grid_item_view);        // Grid item 조회

export default admin;