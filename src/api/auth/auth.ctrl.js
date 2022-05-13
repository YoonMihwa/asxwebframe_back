const client = require('../../db_connect');

// 로그인
export const login = async (ctx) => {
    const { com_id, input_id, input_pw } = ctx.request.body;

    if( !input_id || !input_pw ) {
        ctx.status = 401;
        return;
    };

    const login_ip = requestIp.getClientIp(ctx);

    console.log('login', input_id, input_pw, login_ip);

    const sql = " SELECT * FROM F_LHWS_LOGIN_CHECK( 'LOGIN', $1, $2, $3 ) ";
    const values = [ input_id, input_pw, login_ip ];

    const retVal = await client.query(sql, values);
    if(retVal.rowCount === 0) {
        // console.log('해당 ID가 존재하지 않습니다.');
        ctx.status = 401;
        ctx.body = "해당 ID가 존재하지 않습니다.";
    } else {
        if( retVal.rows[0].user_auth === 'NG' ) {
            ctx.status = 303;
            console.log(retVal.rows[0].user_name)
            ctx.body = retVal.rows[0].user_name;
        } else {
            //비밀번호가 동일하거나 임시비밀번호가 같으면 로그인됨.
            if( retVal.rows[0].pwd_ok === true || retVal.rows[0].temp_pwd_ok === true) {
                if( retVal.rows[0].user_auth === '' || retVal.rows[0].user_auth === 'NONE' ) {
                    ctx.status = 303;
                    // console.log('권한이 없습니다. 관리자에게 문의하세요.')
                    ctx.body = "권한이 없습니다. 관리자에게 문의하세요.";
                } else {
                    if( retVal.rows[0].ip_chk === 'NG') {
                        ctx.status = 303;
                        // console.log('허용된 IP가 아닙니다. 지정된 곳에서만 사용가능 합니다.')
                        ctx.body = "허용된 IP가 아닙니다. 지정된 곳에서만 사용가능 합니다.";
                    } else {
                        ctx.status = 200;
                        const token = await this.generateToken(input_id, login_ip);

                        //LOGIN 이력
                        const logsql = " SELECT * FROM F_LHWS_LOGIN_HISTORY( $1, $2) ";
                        const logvalues = [input_id, login_ip];
                        const logretVal = await client.query(logsql, logvalues);

                        // 로그인 유지 체크시 30분
                        const loginOpt = {
                            maxAge: 1000 * 60 * 60 * 0.5,
                            httpOnly: false,
                        };
                        ctx.cookies.set('access_token', token, loginOpt);     
                        ctx.body = retVal.rows;

                    }
                }
            } else {
                ctx.status = 303;
                ctx.body = "패스워드 오류"
                console.log('패스워드 오류');
            };
        }
        
    };
}


// 사용자정보 등록 & 수정 
// POST /api/auth/register
export const register = async (ctx) => {
    const {com_id, user_id, user_name, user_pwd, user_phone, user_email, user_role, 
           dept_cd, use_yn, pwd_lock_flag, login_ip
          } = ctx.request.body;

    console.log("auth register :", com_id, user_id)
    const sql = "select * from F_USER_MANAGE ('REGISTER', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
    const values = [ com_id, user_id, user_name, user_pwd, user_phone, user_email, user_role,  dept_cd, use_yn, pwd_lock_flag, 
                     login_ip, user_id ];
    const retVal = await client.query(sql, values);

    if( retVal.rows[0].r_result_type === 'OK' ) {
        ctx.status = 200;
        ctx.body = retVal.rows[0].r_result_msg;     // user_id 반환
    } else {
        ctx.status = 400;
        ctx.body = retVal.rows[0].r_result_msg;
    };
};
