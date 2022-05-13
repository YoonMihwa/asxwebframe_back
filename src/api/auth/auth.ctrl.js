const client = require('../../db_connect');
const jwt = require('jsonwebtoken');
var requestIp = require('request-ip');

// 로그인
export const login = async (ctx) => {
    const { com_id, input_id, input_pw } = ctx.request.body;

    if( !input_id || !input_pw ) {
        ctx.status = 401;
        return;
    };

    const login_ip = requestIp.getClientIp(ctx);

    console.log('login', com_id, input_id, input_pw, login_ip);

    const sql = " SELECT * FROM F_LOGIN_CHECK( $1, $2, $3, $4 ) ";
    const values = [ com_id, input_id, input_pw, login_ip ];
    const retVal = await client.query(sql, values);

    if(retVal.rowCount === 0) {
        ctx.status = 401;
        ctx.body = "해당 ID가 존재하지 않습니다.";
    } else {

        if( retVal.rows[0].result_type === 'NG' ) {
            ctx.status = 303;
            console.log('Login NG', retVal.rows[0].result_msg)
            ctx.body = retVal.rows[0].result_msg;       // Error 메세지 출력

        } else {

            ctx.status = 200;
            const token = await this.generateToken(com_id, input_id);

             // 로그인 유지 체크시 1시간
             const loginOpt = {
                maxAge: 1000 * 60 * 60 * 1,
                httpOnly: false,
            };
            ctx.cookies.set('access_token', token, loginOpt);     
            ctx.body = retVal.rows;
            console.log('token', token)
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


// generateToken
exports.generateToken = async ( com_id, user_id ) => {

    const sql =   "select * from F_USER_VIEW($1, $2) ";
    const values = [com_id, user_id];
    const retVal = await client.query(sql, values);
    console.log('generateToken', retVal);

    if( retVal && retVal.rowCount > 0 ) {
        const token = jwt.sign({
            com_id        : retVal.rows[0].com_id,
            user_id        : retVal.rows[0].user_id,
            user_name      : retVal.rows[0].user_name,
            user_role     : retVal.rows[0].user_role      
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '60m', // 30분동안 유효함
        })

        return token;
    }

    return null;
}
