import { Router } from 'express';
import * as postController from '../controller/post-controller.js';
import passport from 'passport';
import auth from '../middlewares/auth.js';

const postRouter = Router();

// 게시글 생성
postRouter.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    postController.addPost(req, res, next);
  }
);

// 내 게시글 목록 조회
postRouter.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    postController.getPostsByUserId(req, res, next);
  }
);

// 게시글 1개 조회
postRouter.get(
  '/user/:postId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    postController.getPost(req, res, next);
  }
);

// 게시글 목록 조회
postRouter.get(
  '/dev',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    postController.getPosts(req, res, next);
  }
);

// 게시글 수정
postRouter.patch(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    postController.updatePostById(req, res, next);
  }
);

// 게시글 삭제
postRouter.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    postController.delPost(req, res, next);
  }
);

// 피드 목록
postRouter.get('/:type', async (req, res, next) => {
  postController.getPostsByCreate(req, res, next);
});

export { postRouter };
