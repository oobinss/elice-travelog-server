import { Router } from 'express';
import * as postController from '../controller/post-controller.js';
import { postService } from '../services/index.js';
import passport from 'passport';
import auth from '../middlewares/auth.js';

const postRouter = Router();

postRouter.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    postController.addPost(req, res, next);
  }
);

export { postRouter };
