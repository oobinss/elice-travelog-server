import { Router } from 'express';
import * as BoardController from '../controller/board-controller.js';
// import { commentService } from '../services/index.js';
import passport from 'passport';
import auth from '../middlewares/auth.js';

const boardRouter = Router();

// 댓글 총 목록 조회 (개발용)
boardRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    commentController.getComments(req, res, next);
  }
);

// 댓글 1개 생성 (개발용)
boardRouter.post(
  '/register/:postId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    commentController.addComment(req, res, next);
  }
);

// 게시글 1개에 대한 댓글 조회
boardRouter.get('/:postId', async (req, res, next) => {
  commentController.getCommentsByPostId(req, res, next);
});

// 북마크 목록에서 선택 삭제
boardRouter.delete(
  '/:commentId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    commentController.delComment(req, res, next);
  }
);

export { boardRouter };
