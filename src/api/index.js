import Router from 'koa-router';
import auth from './auth';
import admin from './admin';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/admin', admin.routes());

export default api;