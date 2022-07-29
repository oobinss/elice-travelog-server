import { Router } from 'express';
import * as tools from '../utils/exception-tools.js';
import passport from 'passport';
import { userService } from '../services/index.js';
import auth from '../middlewares/auth.js';

import * as userController from '../controller/user-controller.js';

const userRouter = Router();

// 유저 등록
userRouter.post('/register', async (req, res, next) => {
  userController.addUser(req, res, next);
});

// 유저 로그인
userRouter.post('/', async function (req, res, next) {
  userController.userLogin(req, res, next);
});

// 비밀번호 체크
userRouter.post(
  '/user/check',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    userController.userPasswordCheck(req, res, next);
  }
);

// kakao 소셜 로그인
userRouter.post('/kakao', async function (req, res, next) {
  userController.socialLoginToken(req, res);
});

// 유저 목록 (배열)
userRouter.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    userController.getUsers(req, res, next);
  }
);

userRouter.get(
  '/user',
  // user jwt-token check
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    userController.getUser(req, res, next);
  }
);

// 유저 수정
userRouter.patch(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    userController.updateUserById(req, res, next);
  }
);

// 유저 삭제
userRouter.delete(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    userController.delUserById(req, res, next);
  }
);

// 현재 유저 정보을 가져옴
userRouter.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    try {
      const userId = req.params.userId;
      const users = await userService.getUserInfo(userId);

      // 사용자 정보를 JSON 형태로 프론트에 보냄
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// 주문서 작성시 사용자 주소 입력
userRouter.put(
  '/:userId',
  /*loginRequired,*/ async function (req, res, next) {
    try {
      tools.isHeaderJSON(req.body);

      const userId = req.params.userId;
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const { address, phoneNumber } = req.body;
      const userInfoRequired = { userId };

      const toUpdate = {
        ...(address && { address }),
        ...(phoneNumber && { phoneNumber }),
      };

      // 사용자 정보를 업데이트함.
      const updatedUserInfo = await userService.setUserAddress(
        userInfoRequired,
        toUpdate
      );

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 권한정보 수정 관리등급이 회원등급에게 권한 부여가능.
userRouter.post(
  '/role',
  /*loginRequired,*/ async function (req, res, next) {
    try {
      tools.isHeaderJSON(req.body);

      const userRole = await req.currentUserRole;
      if (userRole !== 'admin') {
        console.log(`${userRole}의 전체 권한 부여 요청이 거부됨`);
        throw new Error('권한이 없습니다.');
      }
      const email = await req.body.email;

      // 사용자 정보를 업데이트함.
      const setRoleInfo = await userService.setRole(email);

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(setRoleInfo);
    } catch (error) {
      next(error);
    }
  }
);

//유저 id값을 받아서 이름을 반환(게시판에서 사용)
userRouter.get(
  '/:userId/name',
  /*loginRequired,*/ async function (req, res, next) {
    try {
      const currentUserId = req.currentUserId;
      const userRole = await req.currentUserRole;
      const userId = req.params.userId;

      if (userId !== currentUserId && userRole !== 'admin') {
        console.log(`${userRole}의 userId로 이름조회 요청이 거부됨`);
        throw new Error('권한이 없습니다.');
      }

      const userName = await userService.getUserInfo(userId);
      const { fullName } = userName;
      res.status(200).json({ fullName });
    } catch (error) {
      next(error);
    }
  }
);

// 아이디값가져오는 api (아래는 /id 이지만, 실제로는 /api/users/id 요청해야 함.)
userRouter.get(
  '/id',
  /*loginRequired,*/ async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      // id를 프론트에 보냄 (id는, object ID임)
      res.status(200).json({ userId });
    } catch (error) {
      next(error);
    }
  }
);
export { userRouter };
