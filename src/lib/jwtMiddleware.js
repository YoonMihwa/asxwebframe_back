const jwt = require('jsonwebtoken');
const authCtrl = require('../api/auth/auth.ctrl');

const jwtMiddleware = async (ctx, next) => {
  let token = ctx.cookies.get('access_token');
  if (!token) return next(); // 토큰이 없음

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      com_id        : decoded.com_id       ,
      user_id       : decoded.user_id       ,
      user_name     : decoded.user_name     ,
      user_role     : decoded.user_role
    };

    // 토큰 30분 미만 남으면 재발급
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp - now < 60 * 60 * 0.5 ) {
      token = await authCtrl.generateToken(decoded.user_id, decoded.login_ip);
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 1, // 1시간
        httpOnly: true,
      });
    } 

    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
};

module.exports = jwtMiddleware;
