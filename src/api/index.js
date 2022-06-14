import Router from 'koa-router';
import auth from './auth';
import admin from './admin';
import service from './service';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/admin', admin.routes());
api.use('/service', service.routes());

export default api;