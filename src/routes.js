import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Only routes after this point will have this middleware applied
routes.use(authMiddleware);
routes.put('/users', authMiddleware, UserController.update);

export default routes;
