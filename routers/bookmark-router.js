import { Router } from 'express';
import * as bookmarkController from '../controller/bookmark-controller.js';
import passport from 'passport';
import auth from '../middlewares/auth.js';

const bookmarkRouter = Router();

// 북마크 총 목록 조회 (개발용)
bookmarkRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
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
bookmarkRouter.delete(
  '/folder/delete',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.delBookmarks(req, res, next);
  }
);

// 동일명 폴더가 프론트에 존재시 생성 불가능 로직 부탁드리기
// 북마크 폴더째 삭제
bookmarkRouter.delete(
  '/folder/delete/:folderName',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.delFolder(req, res, next);
  }
);

// 북마크 폴더명 수정
bookmarkRouter.patch(
  '/folder/rename',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.updateFolderName(req, res, next);
  }
);

// 북마크 폴더내 1개의 메모 수정
bookmarkRouter.patch(
  '/folder/bookmark',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    bookmarkController.updateBookmarkMemo(req, res, next);
  }
);

export { bookmarkRouter };
