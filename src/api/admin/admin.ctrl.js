const client = require('../../db_connect');

// 통합코드 조회
// POST api/admin/code_search
export const code_search = async (ctx) => {
    const { com_id, lang_code, code_class } = ctx.request.body;

    try {

        // console.log('search main_code : ', main_code );
        const sql = "SELECT * FROM F_CODE_SEARCH( $1, $2, $3, $4 ) ";
        const values = [ 'SUB', com_id, lang_code, code_class ];
    
        let result = {};
        let search_word = [];

        const retVal = await client.query(sql, values);
        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            search_word = code_class.split(",");

            for(let i=0; i<= search_word.length -1; i++) {
                result[search_word[i]] = (retVal.rows.filter(v => v.code_class === search_word[i]));         
            }

            ctx.status = 200;
            ctx.body = result;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }
};


// 통합코드 조회
// POST api/admin/class_search
export const class_search = async (ctx) => {
    const { com_id, lang_code, code_class } = ctx.request.body;

    try {
        // console.log('search main_code : ', main_code );
        const sql = "SELECT * FROM F_CODE_SEARCH( $1, $2, $3, $4 ) ";
        const values = [ 'MAIN', com_id, lang_code, code_class ];
    
        let result = {};
        let search_word = [];

        const retVal = await client.query(sql, values);
        if( retVal.rowCount === 0 ){
            ctx.body = [];
        } else {
            search_word = code_class.split(",");

            for(let i=0; i<= search_word.length -1; i++) {
                result[search_word[i]] = (retVal.rows.filter(v => v.code_class === search_word[i]));         
            }

            ctx.status = 200;
            ctx.body = result;
        }
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }        
};


// company 조회
// POST api/admin/company_list
export const company_list = async (ctx) => {
    // const { com_id } = ctx.request.body;

    try {
        const sql = "SELECT * FROM F_COM_SEARCH( $1 ) ";
        const values = [ '' ];
    
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


// 통합코드 등록 및 수정
// POST /api/admin/code_register
export const code_register = async (ctx) => {
    const { codes } = ctx.request.body;

    // console.log('code register', codes)

    try {
        if( codes && Array.isArray(codes) ) {
            codes.forEach(async code => {
                console.log('Codes write...', code.code_class, code.code_id, code.code_name);

                try {
                    const sql =  "select * from F_CODE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
                    const values = ['REGISTER', '', code.code_class, code.code_id, code.code_name, code.lang_id, code.seq,
                                    code.use_yn, code.memo, ctx.state.user.login_ip, ctx.state.user.user_id];
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
            })
        };

        ctx.status = 200;
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }     
};


// 회사별 통합코드
// POST /api/admin/code_register
export const comcode_register = async (ctx) => {
    const { codes } = ctx.request.body;

    try {
        // console.log('code register', codes)

        if( codes && Array.isArray(codes) ) {
            codes.forEach(async code => {
                console.log('com codes write...', code.com_id, code.code_class, code.code_id, code.code_name);
                
                try {
                    const sql =  "select * from F_CODE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
                    const values = ['COMCODEREG', code.com_id, code.code_class, code.code_id, code.code_name, code.lang_id, code.seq,
                                    code.use_yn, code.memo, ctx.state.user.login_ip, ctx.state.user.user_id];
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
            })
        };

        ctx.status = 200;
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    }          
};


// 통합코드 temp_cd에 내용 등록 ( 통합코드를 따로 관리할 회사id 등록)
// POST /api/admin/code_temp_update
export const tempcd_update = async (ctx) => {
    const { code_class, memo } = ctx.request.body;

    try {

        const sql =  "select * from F_CODE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
        const values = ['ADDREG', '', code_class, '', '', '', 0,
                        '', memo, ctx.state.user.login_ip, ctx.state.user.user_id];
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


// 통합코드 display 순서 변경
// POST /api/admin/code_display
export const code_display = async (ctx) => {
    const { code_class, code_id, display_seq} = ctx.request.body;

    try {   
        const sql =  "select * from F_CODE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
        const values = ['DISPLAY_SEQ', '', code_class, code_id, '', '', display_seq,
                        '', '', ctx.state.user.login_ip, ctx.state.user.user_id];
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


// 프로그램 등록
// POST /api/admin/pgm_register
export const pgm_register = async (ctx) => {
    const { pgm_id, pgm_type, pgm_name, lang_id, pgm_lvl, pgm_seq, icon, p_id, pgm_route, use_yn } = ctx.request.body;

    try {   
        const sql =  "select * from F_PGM_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
        const values = ['REGISTER', pgm_id, pgm_type, pgm_name, lang_id, pgm_lvl, pgm_seq, icon, p_id, pgm_route, 
                        use_yn, ctx.state.user.login_ip, ctx.state.user.user_id];
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

// 프로그램 조회
// POST api/admin/pgm_list
export const pgm_list = async (ctx) => {
    const { pgm_id } = ctx.request.body;

    console.log('pgm search : ', pgm_id );
    const sql = "SELECT * FROM F_CODE_SEARCH( $1, $2, $3 ) ";
    const values = [ 'SUB', com_id, code_class ];
 
    const retVal = await client.query(sql, values);
    if( retVal.rowCount === 0 ){
        ctx.body = [];
    } else {
        search_word = code_class.split(",");

        for(let i=0; i<= search_word.length -1; i++) {
            result[search_word[i]] = (retVal.rows.filter(v => v.code_class === search_word[i]));         
        }

        ctx.status = 200;
        ctx.body = result;
    }
};


// Language 등록
// POST /api/admin/lang_register
export const lang_register = async (ctx) => {
    const { lang_id, languages, lang_type, remark, use_yn } = ctx.request.body;

    try {   
        if( languages && Array.isArray(languages) ) {
            languages.forEach(async lang => {
                console.log('Codes write...', lang_id, lang.lang_code, lang.lang_name, lang_type);

                try {   
                    const sql =  "select * from F_LANGUAGE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
                    const values = ['REGISTER', lang_id, lang.lang_code, lang.lang_name, lang_type, use_yn,
                            remark, ctx.state.user.login_ip, ctx.state.user.user_id];
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
            })
        };

        ctx.status = 200;
    } catch(e) {
        console.error(e);
        ctx.status = 400;
    } 
};

// Language 조회
// POST api/admin/lang_search
export const lang_search = async (ctx) => {
    const { lang_id, lang_code, lang_name, lang_type } = ctx.request.body;
    
    console.log('lang_search : ', lang_id, lang_code );

    try {   
        const sql = "SELECT * FROM F_LANGUAGE_SEARCH( $1, $2, $3, $4 ) ";
        const values = [ lang_id, lang_code, lang_name, lang_type ];
    
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

// Language id를 lang_code별로 조회
// POST api/admin/multi_lang_search
export const multi_lang_search = async (ctx) => {
    const { lang_id, lang_name, lang_type } = ctx.request.body;

    try {   
        console.log('multi_lang_search : ', lang_id );
        const sql = "SELECT * FROM F_MULTI_LANGUAGE_SEARCH( $1, $2, $3 ) ";
        const values = [ lang_id, lang_name, lang_type ];
    
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


// Grid main 등록
// POST /api/admin/grid_register
export const grid_register = async (ctx) => {
    const { grid_id, grid_desc, use_yn } = ctx.request.body;

    try {   
        let sql =  "select * from F_GRID_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, "
            sql += "                             $21, $22, $23, $24, $25 )";
        const values = ['GRID_REGISTER', grid_id, grid_desc, 0,'','','','','','','','','','','','','','','','',
                        '', '0', use_yn, ctx.state.user.login_ip, ctx.state.user.user_id];
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

// Grid 조회
// POST api/admin/grid_list
export const grid_list = async (ctx) => {
   
    try {   
        // console.log('lang_search : ', lang_id, lang_code );
        const sql = "SELECT * FROM F_GRID_LIST(  ) ";
    
        const retVal = await client.query(sql);
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

// Grid items 등록
// POST /api/admin/grid_items
export const grid_items = async (ctx) => {
    const { grid_id,  
            item_id,			//-- item id
	        item_name,			//-- 컬럼명
	        item_caption,		//-- 헤더명
	        data_type,			//-- 셀 형식 string/number/date/boolean/object/datetime
	        btn_text,			//-- 버튼명
	        btn_event,			//-- 버튼 이벤트 (onTextClick)
	        headbtn_text,		//-- Header 버튼명			-- 10
	        headbtn_event,		//-- Header 버튼 이벤트 (onClickHeadBtn)
	        width,				//-- 너비
	        digit,				//-- 소수점 자릿수	
	        icon,				//-- icon
	        icon_wdith,		    //-- icon 너비			
	        icon_height,		//-- icon 높이
	        alignment,			//-- 정렬 right/center/left
	        visible_yn,		    //-- 숨김여부 true / false
	        fixed_yn,		    //-- 열고정 defulat: false	-- 20
	        format,		        //-- 포맷  billions/currency/day/decimal/exponential/fixedPoint/largeNumber/longDate/longTime/millions/millisecond/month/monthAndDay/monthAndYear/percent/quarter/quarterAndYear/shortDate/shortTime/thousands/trillions/year/dayOfWeek/hour/longDateLongTime/minute/second/shortDateShortTime default ''
	        doubleHeader,	    //-- doubleHeader
	        display_seq,		//-- 정렬순서	
            use_yn              //-- 
        } = ctx.request.body;

    try {   
        let sql =  "select * from F_GRID_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, "
            sql += "                             $21, $22, $23, $24, $25)";
        const values = ['ITEM_REGISTER', grid_id, '', item_id, item_name, item_caption, data_type, btn_text, btn_event, headbtn_text, 
                        headbtn_event, width, digit, icon, icon_wdith, icon_height, alignment, visible_yn, fixed_yn, format,    
                        doubleHeader, display_seq, use_yn, ctx.state.user.login_ip, ctx.state.user.user_id];
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

// Grid items 조회
// POST api/admin/grid_item_view
export const grid_item_view = async (ctx) => {
    const { grid_id, lang_code } = ctx.request.body;

    try {   
        console.log('grid_item_view : ', grid_id, lang_code );
        const sql = "SELECT * FROM F_GRID_ITEM_VIEW( $1, $2 ) ";
        const values = [ grid_id, lang_code];
    
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

// Grid items display 순서 변경
// POST /api/admin/item_display
export const item_display = async (ctx) => {
    const { grid_id, item_id, display_seq} = ctx.request.body;

    try {   

        let sql =  "select * from F_GRID_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, "
            sql += "                             $21, $22, $23, $24, $25)";
        const values = ['CHANGE_DISPLAY', grid_id, '', item_id, '', '', '', '', '', '', 
        '', '', '', '', '', '', '', '', '', '',    
        '', display_seq, '', ctx.state.user.login_ip, ctx.state.user.user_id];
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

// Grid item 삭제
// POST api/admin/grid_item_del
export const grid_item_del = async (ctx) => {
    const { grid_id, item_id } = ctx.request.body;

    try {   
        console.log('grid_item_del : ', grid_id, item_id );
        let sql =  "select * from F_GRID_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, "
            sql += "                             $21, $22, $23, $24, $25)";
        const values = ['ITEM_DELETE', grid_id, '', item_id, '', '', '', '', '', '', 
                        '', '', '', '', '', '', '', '', '', '',    
                        '', '0', '', ctx.state.user.login_ip, ctx.state.user.user_id];
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


// Control 등록
// POST /api/admin/ctrl_register
export const ctrl_register = async (ctx) => {
    const { ctrl_id, ctrl_lang_id, visible_yn, default_value, ctrl_type } = ctx.request.body;

    try {   
        const sql =  "select * from F_CONTROL_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
        const values = ['CTRL_REGISTER', ctrl_id, ctrl_lang_id, visible_yn, default_value, ctrl_type, '', ctx.state.user.login_ip, ctx.state.user.user_id];
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

// Control 조회
// POST api/admin/ctrl_search
export const ctrl_search = async (ctx) => {
    const { ctrl_id, ctrl_lang_id, ctrl_name, ctrl_type } = ctx.request.body;

    try {   
        console.log('ctrl_search : ', ctrl_id, ctrl_lang_id,ctrl_name );
        const sql = "SELECT * FROM F_CONTROL_VIEW( $1, $2, $3, $4 ) ";
        const values = [ ctrl_id, ctrl_lang_id, ctrl_name, ctrl_type ];
    
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

// Control 삭제
// delete /api/admin/ctrl_del
export const ctrl_del = async (ctx) => {
    const { ctrl_id } = ctx.request.body;

    try {   
        console.log('ctrl_del', ctrl_id)
        const sql =  "select * from F_CONTROL_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
        const values = ['CTRL_DELETE', ctrl_id, '', '', '', '','', ctx.state.user.login_ip, ctx.state.user.user_id];
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

// Error Log
// POST /api/admin/err_log
export const err_log = async (ctx) => {
    const { err_id, api_url, sys_err_msg, ctx_err_msg, user_memo, page_code } = ctx.request.body;

    try {   
        const sql =  "select * from F_ERROR_LOG ($1, $2, $3, $4, $5, $6, $7, $8)";
        const values = [err_id, api_url, sys_err_msg, ctx_err_msg, user_memo, page_code, ctx.state.user.login_ip, ctx.state.user.user_id];
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


// Error Log 조회
// POST api/admin/err_log_search
export const err_log_search = async (ctx) => {
    const { from_date, to_date, search_user } = ctx.request.body;

    try {   
        console.log('err_log_search : ', from_date, to_date, search_user );
        const sql = "SELECT * FROM F_ERRLOG_SEARCH( $1, $2, $3 ) ";
        const values = [ from_date, to_date, search_user];
    
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