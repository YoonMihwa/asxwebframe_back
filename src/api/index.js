import Router from 'koa-router';
import auth from './auth';
import admin from './admin';
import servicedesk from './servicedesk';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/admin', admin.routes());
api.use('/servicedesk', servicedesk.routes());

export default api;