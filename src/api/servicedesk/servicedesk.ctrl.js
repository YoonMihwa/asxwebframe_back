const client = require('../../db_connect');

// Service Desk 조회
// POST api/servicedesk/search
export const search = async (ctx) => {
    const { date_type, from_date, to_date, status, main_type, sub_type, user_type, user_name, lang_code } = ctx.request.body;
    
    console.log('lang_search : ', date_type, status );

    try {   
        const sql = "SELECT * FROM F_SERVICE_SEARCH( $1, $2, $3, $4, $5, $6, $7, $8, $9 ) ";
        const values = [ date_type, from_date, to_date, status, main_type, sub_type, user_type, user_name, lang_code ];

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


// Service Desk 상세 조회
// POST api/servicedesk/view
export const view = async (ctx) => {
    const { req_id, lang_code } = ctx.request.body;
    
    console.log('servicedesk view : ', req_id, lang_code );

    let sd_info = {
        servicedesk: [],
        files: []
    };

    try {   
        const sql = "SELECT * FROM F_SERVICEDESK_VIEW( $1, $2) ";
        const filesql = "SELECT * FROM F_FILE_VIEW( $1 ) ";
        const values = [ req_id, lang_code ];
        const filevalues = [ req_id ];

        const retVal = await client.query(sql, values);
        const fileVal = await client.query(filesql, filevalues);

        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            ctx.status = 200;
            sd_info.servicedesk = retVal.rows;
            sd_info.files = fileVal.rows;

            ctx.body = sd_info;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};


// Service Desk 등록
// POST /api/servicedesk/request
export const request = async (ctx) => {
    const { req_id, status, req_user, main_type, sub_type, title, contents, due_date, cost, asset_id, use_yn,
            files
          } = ctx.request.body;
    
    console.log('service request: ', req_id)

    try {   
        const sql =  "select * from F_SERVICE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) "
        const values = ['REQUEST', req_id, status, req_user, main_type, sub_type, title, contents, due_date, cost, 
                        asset_id, '','','','','','', use_yn, ctx.state.user.login_ip, ctx.state.user.user_id];
        const retVal = await client.query(sql, values);

        if( retVal.rows[0].r_result_type === 'OK' ) {
            ctx.status = 200;
            ctx.body = retVal.rows[0].r_result_msg;
            const v_req_id = retVal.rows[0].r_result_msg;

            console.log('v_req_id: ', v_req_id)

            //-- 파일저장
            const fileUpload = await this.file_upload({req_id:v_req_id, req_status:"request", files:files, user_id:ctx.state.user.user_id, login_ip:ctx.state.user.login_ip});
            console.log('fileUpload: ', fileUpload)

        } else {
            ctx.status = 400;
            ctx.body = retVal.rows[0].r_result_msg;
        };
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};

// Service Desk 등록
// POST /api/servicedesk/file_upload
export const file_upload = async (ctx) => {
    // const { req_id,         // 요청문서id
    //         req_status,     // 요청문서 상태 : 요청request, 처리process
    //         files           // 파일내용 배열
    //       } = ctx.request.body;

    let req_id= null;
    let req_status= null;
    let files= [];
    let user_id= null;
    let login_ip= null;

    if(ctx.hasOwnProperty('request')) {
        console.log('api')
        req_id = ctx.request.body.req_id;
        req_status = ctx.request.body.req_status;
        files = ctx.request.body.files;
        user_id = ctx.request.body.user_id;
        login_ip = ctx.request.body.login_ip;        
    }
    else {
        req_id = ctx.req_id;
        req_status = ctx.req_status;
        files = ctx.files;
        user_id = ctx.user_id;
        login_ip = ctx.login_ip;
        console.log('일반 호출')
    }          

    if( !req_id ) {
        ctx.status = 401;
        return;
    }

    console.log('file_upload: ', req_id, req_status)
    let count = 0;

    try { 
        // 첨부파일 등록
        if( files && Array.isArray(files) ) {
            files.forEach(async file=> {
                // console.log('file write...', doc_id, file.file_name, file.contenttype);
   
                try {
                    if( file.file_name && file.file_data ) {
                        
                        count += 1;
                        const file_sql =  " select * from F_FILE_MANAGE ('FILE_REGISTER', $1, $2, $3, $4, $5, $6, $7, $8, $9) ";
                        const file_values = [ req_id, req_status, count, file.file_name, file.file_type, file.file_data, '', login_ip, user_id];
                        const file_retVal = await client.query(file_sql, file_values);
            
                        if( file_retVal.rows[0].r_result_type === 'OK' ) {
                            ctx.status = 200;
                            console.log("첨부파일 등록", file_retVal.rows[0].r_result_msg)
                            ctx.body = file_retVal.rows[0].r_result_msg;
                    
                        } else {
                            ctx.status = 400;
                            ctx.body = file_retVal.rows[0].r_result_msg;
                        };                    
    
                    } 
                } catch(e) {
                    console.error(e);
                    ctx.status = 402;
                }
            })
        };  
    
        ctx.status = 200;

    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};


// Service Desk 접수
// POST /api/servicedesk/receipt
export const receipt = async (ctx) => {
    const { req_id, rec_user, due_date, rec_type, rec_memo
          } = ctx.request.body;

    try {   
        const sql =  "select * from F_SERVICE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) "
        const values = ['RECEIPT', req_id, '', '', '', '', '', '', '', '', 
                        '', rec_user, due_date, rec_type, rec_memo, '', '', use_yn, ctx.state.user.login_ip, ctx.state.user.user_id];
        const retVal = await client.query(sql, values);   

        if( retVal.rows[0].r_result_type === 'OK' ) {
            ctx.status = 200;
            ctx.body = retVal.rows[0].r_result_msg;

        } else {
            ctx.status = 400;
            ctx.body = retVal.rows[0].r_result_msg;
        };
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }         
};

