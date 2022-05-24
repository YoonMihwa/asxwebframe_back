const client = require('../../db_connect');

// 통합코드 조회
// POST api/admin/code_search
export const code_search = async (ctx) => {
    const { com_id, lang_id, code_class } = ctx.request.body;

    // console.log('search main_code : ', main_code );
    const sql = "SELECT * FROM F_CODE_SEARCH( $1, $2, $3, $4 ) ";
    const values = [ 'SUB', com_id, lang_id, code_class ];
 
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
};


// 통합코드 조회
// POST api/admin/class_search
export const class_search = async (ctx) => {
    const { com_id, lang_id, code_class } = ctx.request.body;

    // console.log('search main_code : ', main_code );
    const sql = "SELECT * FROM F_CODE_SEARCH( $1, $2, $3, $4 ) ";
    const values = [ 'MAIN', com_id, lang_id, code_class ];
 
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
};


// 통합코드 등록 및 수정
// POST /api/admin/code_register
export const code_register = async (ctx) => {
    const { codes } = ctx.request.body;

    // console.log('code register', codes)

    if( codes && Array.isArray(codes) ) {
        codes.forEach(async code => {
            console.log('Codes write...', code.code_class, code.code_id, code.code_name);

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
        })
    };

    ctx.status = 200;
};


// 회사별 통합코드
// POST /api/admin/code_register
export const comcode_register = async (ctx) => {
    const { codes } = ctx.request.body;

    // console.log('code register', codes)

    if( codes && Array.isArray(codes) ) {
        codes.forEach(async code => {
            console.log('com codes write...', code.com_id, code.code_class, code.code_id, code.code_name);

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
        })
    };

    ctx.status = 200;
};


// 통합코드 temp_cd에 내용 등록
// POST /api/admin/code_temp_update
export const tempcd_update = async (ctx) => {
    const { code_class, code_id, memo } = ctx.request.body;

    const sql =  "select * from F_CODE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
    const values = ['ADDREG', '', code_class, code_id, '', '', 0,
                    '', memo, ctx.state.user.login_ip, ctx.state.user.user_id];
    const retVal = await client.query(sql, values);

    if( retVal.rows[0].r_result_type === 'OK' ) {
        ctx.status = 200;
        ctx.body = retVal.rows[0].r_result_msg;

    } else {
        ctx.status = 400;
        ctx.body = retVal.rows[0].r_result_msg;
    };
};


// 프로그램 등록
// POST /api/admin/pgm_register
export const pgm_register = async (ctx) => {
    const { pgm_id, pgm_type, pgm_name, lang_id, pgm_lvl, pgm_seq, icon, p_id, pgm_route, use_yn } = ctx.request.body;

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
    const { lang_id, lang_code, lang_name, lang_type, use_yn } = ctx.request.body;

    const sql =  "select * from F_LANGUAGE_MANAGE ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
    const values = ['REGISTER', lang_id, lang_code, lang_name, lang_type, use_yn,
                     '', ctx.state.user.login_ip, ctx.state.user.user_id];
    const retVal = await client.query(sql, values);

    if( retVal.rows[0].r_result_type === 'OK' ) {
        ctx.status = 200;
        ctx.body = retVal.rows[0].r_result_msg;

    } else {
        ctx.status = 400;
        ctx.body = retVal.rows[0].r_result_msg;
    };
};

// Language 조회
// POST api/admin/lang_search
export const lang_search = async (ctx) => {
    // const { lang_id, lang_code } = ctx.request.body;

    // console.log('lang_search : ', lang_id, lang_code );
    const sql = "SELECT * FROM F_LANGUAGE_SEARCH( $1, $2 ) ";
    const values = [ '','' ];
 
    const retVal = await client.query(sql, values);
    if( retVal.rowCount === 0 ){
        ctx.body = [];
    } else {
        
        ctx.status = 200;
        ctx.body = retVal.rows;;
    }
};
