const client = require('../../db_connect');

// Asset 조회
// POST api/asset/search
export const search = async (ctx) => {
    const { com_id, date_type, from_date, to_date, status, asset_type, maker, model, user_name, lang_code } = ctx.request.body;
    
    console.log('asset_search : ', com_id, from_date, to_date, status );

    try {   
        const sql = "SELECT * FROM F_ASSET_SEARCH( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) ";
        const values = [ com_id, date_type, from_date, to_date, status, asset_type, maker, model, user_name, lang_code ];

        const retVal = await client.query(sql, values);
        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            
            ctx.status = 200;
            ctx.body = retVal.rows;;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};

// 자산 상세 조회
// POST api/asset/view
export const view = async (ctx) => {
    const { com_id, asset_id, lang_code } = ctx.request.body;
    
    console.log('asset view : ', asset_id, lang_code );

    let asset_info = {
        asset: [],
        action: []
    };

    try {   
        const sql = "SELECT * FROM F_ASSET_VIEW( $1, $2, $3) ";
        const actionsql = "SELECT * FROM F_ACTION_VIEW( $1, $2, $3 ) ";
        const values = [ com_id, asset_id, lang_code ];

        const retVal = await client.query(sql, values);
        const actionVal = await client.query(actionsql, values);

        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            ctx.status = 200;
            asset_info.asset = retVal.rows;
            asset_info.action = actionVal.rows;

            ctx.body = asset_info;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};


// 자산 등록
// POST /api/asset/register
export const register = async (ctx) => {
    let { asset_id, asset_status, asset_type, maker, model, asset_sn, asset_location, buy_date, buy_company, 
            cpu, ram, hdd, asset_qty
          } = ctx.request.body;

    console.log('asset register: ', asset_qty, asset_id, asset_status)

    if(!asset_qty || typeof asset_qty == "undefined"){
        asset_qty = 1;
    }

    try { 
        
        for(let i=1; i<=asset_qty; i++) {
            // console.log('asset register i: ', i)
            const sql =  "select * from F_ASSET_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) "
            const values = ['REGISTER', ctx.state.user.com_id, asset_id, asset_status, asset_type, maker, model, asset_sn, asset_location, buy_date, 
                            buy_company, cpu, ram, hdd, '', ctx.state.user.login_ip, ctx.state.user.user_id];
            const retVal = await client.query(sql, values);

            if( retVal.rows[0].r_result_type === 'OK' ) {
                ctx.status = 200;
                ctx.body = retVal.rows[0].r_result_msg;
                const v_req_id = retVal.rows[0].r_result_msg;

            } else {
                ctx.status = 400;
                ctx.body = retVal.rows[0].r_result_msg;
            };
        }
        
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};

// 자산 Action 등록
// POST /api/asset/act_register
export const act_register = async (ctx) => {
    let { asset_id, action_id, act_type, act_date, req_id, act_user, user_ip, remark
          } = ctx.request.body;

    console.log('asset act register: ', asset_id)

    try { 
        const sql =  "select * from F_ACTION_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) "
        const values = ['ACT_REGISTER', ctx.state.user.com_id, asset_id, action_id, act_type, act_date, req_id, act_user, user_ip, remark,
                        '', ctx.state.user.login_ip, ctx.state.user.user_id];
        const retVal = await client.query(sql, values);

        if( retVal.rows[0].r_result_type === 'OK' ) {
            ctx.status = 200;
            ctx.body = retVal.rows[0].r_result_msg;
            const v_req_id = retVal.rows[0].r_result_msg;

        } else {
            ctx.status = 400;
            ctx.body = retVal.rows[0].r_result_msg;
        };
       
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};


// 소모품 조회
// POST api/asset/exp_search
export const exp_search = async (ctx) => {
    const { com_id, date_type, from_date, to_date, exp_type, maker, model, lang_code } = ctx.request.body;
    
    console.log('expendables_search : ', com_id, from_date, to_date );

    try {   
        const sql = "SELECT * FROM F_EXPENDABLE_SEARCH( $1, $2, $3, $4, $5, $6, $7, $8 ) ";
        const values = [ com_id, date_type, from_date, to_date, exp_type, maker, model, lang_code ];

        const retVal = await client.query(sql, values);
        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            
            ctx.status = 200;
            ctx.body = retVal.rows;;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};

// 소모품 집계
// POST api/asset/exp_summary
export const exp_summary = async (ctx) => {
    const { com_id, date_type, from_date, to_date, exp_type, maker, model, lang_code } = ctx.request.body;
    
    console.log('expendables_search : ', com_id, from_date, to_date );

    try {   
        const sql = "SELECT * FROM F_EXPENDABLE_SUMMARY( $1, $2, $3, $4, $5, $6, $7, $8 ) ";
        const values = [ com_id, date_type, from_date, to_date, exp_type, maker, model, lang_code ];

        const retVal = await client.query(sql, values);
        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            
            ctx.status = 200;
            ctx.body = retVal.rows;;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};


// 소모품 상세 조회
// POST api/asset/exp_view
export const exp_view = async (ctx) => {
    const { com_id, exp_id, lang_code } = ctx.request.body;
    
    console.log('expendables view : ', com_id, exp_id, lang_code );

    try {   
        const sql = "SELECT * FROM F_EXPENDABLE_VIEW( $1, $2, $3 ) ";
        const values = [ com_id, exp_id, lang_code ];

        const retVal = await client.query(sql, values);
        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            
            ctx.status = 200;
            ctx.body = retVal.rows;;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};