import Router from 'koa-router';
import auth from './auth';
import admin from './admin';
import servicedesk from './servicedesk';
import asset from './asset';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/admin', admin.routes());
api.use('/servicedesk', servicedesk.routes());
api.use('/asset', asset.routes());

export default api;