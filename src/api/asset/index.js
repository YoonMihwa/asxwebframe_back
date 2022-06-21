import Router from "koa-router";
import * as assetCtrl from './asset.ctrl';

const asset = new Router();

asset.post('/search', assetCtrl.search);                // 자산 조회
asset.post('/view', assetCtrl.view);                    // 상세조회
asset.post('/register', assetCtrl.register);            // 자산등록
asset.post('/act_register', assetCtrl.act_register);    // 자산 Action 등록

asset.post('/exp_search', assetCtrl.exp_search);        // 소모품 조회
asset.post('/exp_view', assetCtrl.exp_view);            // 소모품 상세조회
asset.post('/exp_summary', assetCtrl.exp_summary);      // 소모품 집계
asset.post('/exp_register', assetCtrl.exp_register);    // 소모품 입고처리

export default asset;