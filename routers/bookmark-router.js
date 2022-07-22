import { Router } from 'express';
import * as bookmarkController from '../controller/bookmark-controller.js';
// import { bookmarkService } from '../services/index.js';
import passport from 'passport';
import auth from '../middlewares/auth.js';

const bookmarkRouter = Router();

// 북마크 총 목록 조회 (개발용)
bookmarkRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    console.log('in');
    bookmarkController.getBookmarksByUser(req, res, next);
  }
);

// 북마크 1개 생성 (개발용)
bookmarkRouter.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.addBookmark(req, res, next);
  }
);

// 북마크 목록 생성
bookmarkRouter.post(
  '/registers',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.addBookmarks(req, res, next);
  }
);

// 내 북마크 폴더명 조회
bookmarkRouter.get(
  '/folders',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.getBookmarkName(req, res, next);
  }
);

// 폴더 조회해 나오는 북마크들
bookmarkRouter.get(
  '/folder/:folderName',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.getBookmarksByFolder(req, res, next);
  }
);

// 북마크 목록에서 선택 삭제
// 북마크 목록에서 선택 수정(폴더명, 메모) => 폴더명만 수정, 메모만 수정... => 메모는 각각?

// 게시글 1개 조회
// bookmarkRouter.get(
//   '/user/:postId',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res, next) => {
//     bookmarkController.getPost(req, res, next);
//   }
// );

// 게시글 수정
// bookmarkRouter.patch(
//   '/:postId',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res, next) => {
//     bookmarkController.updatePostById(req, res, next);
//   }
// );

// 게시글 삭제
// bookmarkRouter.delete(
//   '/:postId',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res, next) => {
//     bookmarkController.delPost(req, res, next);
//   }
// );

export { bookmarkRouter };
