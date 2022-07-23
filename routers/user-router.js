import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
// import { loginRequired } from '../middlewares/index.js';
import passport from 'passport';
import { userService } from '../services/index.js';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth.js';

import * as userController from '../controller/user-controller.js';

const userRouter = Router();

/**
 * @swagger
 *  /api/users/register:
 *    post:
 *      tags:
 *      - user
 *      description: 유저 등록
 *      produces:
 *      - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: 'swagger/user.yaml#/components/schemas/User'
 *      responses:
 *       '200':
 *          description: 유저 등록 성공
 */
userRouter.post('/register', async (req, res, next) => {
  userController.addUser(req, res, next);
});

/**
 * @swagger
 *  /api/users:
 *    post:
 *      tags:
 *      - user
 *      description: 유저 로그인 (토큰 발급)
 *      produces:
 *      - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: 'swagger/user.yaml#/components/schemas/User'
 *      responses:
 *       '200':
 *          description: 유저 로그인 성공
 */
userRouter.post('/', async function (req, res, next) {
  userController.userLogin(req, res, next);
});
/*
// passport.js LocalStrategy 사용하는 경우 (+session), 현재 사용하진 않으나 기록용으로 두는 중, 프로젝트 업로드시 삭제
userRouter.post(
  '/',
  passport.authenticate('local'),
  async function (req, res, next) {
    try {
      // 로그인 성공 -> JWT 웹 토큰 생성
      const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

      // 2개 프로퍼티를 jwt 토큰에 담음 (이메일과 이메일서명)
      const userId = req.user.email;
      const token = jwt.sign({ userId: userId }, secretKey);

      // 로그인 진행 성공시 userId(문자열) 와 jwt 토큰(문자열)을 프론트에 보냄
      // res.status(200).json({ userId, token });
      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
    }
  }
);
*/

/**
 * @swagger
 *  /api/users/kakao:
 *    get:
 *      tags:
 *      - user
 *      description: kakao 소셜 로그인 (토큰받아서 토큰 반환)
 *      produces:
 *      - application/json
 *      responses:
 *       '200':
 *          description: 유저 소셜 로그인
 */

//* 카카오로 로그인하기 라우터 ***********************
//? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고,
//  카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
userRouter.get('/kakao', passport.authenticate('kakao'));

//? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
userRouter.get(
  '/kakao/callback',
  //? 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate('kakao', {
    failureMessage: 'login failure',
    // failureRedirect: '/n', // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  async function (req, res, next) {
    // res.redirect('/');

    // 로그인 인증된 코드의 토큰을 발급
    userController.socialLoginToken(req, res, next);
  }
);

/**
 * @swagger
 *  /api/users:
 *    get:
 *      tags:
 *      - user
 *      description: 유저 목록 (배열)
 *      produces:
 *      - application/json
 *      responses:
 *       '200':
 *          description: 유저 목록 조회 성공
 */
/*
 *          schema:
 *            $ref: './swagger/user.yaml#/components/schemas/User'
 */
userRouter.get(
  '/users',
  // user jwt-token check
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

/**
 * @swagger
 *  /api/users/:userId:
 *    patch:
 *      tags:
 *      - user
 *      description: 유저 수정
 *      produces:
 *      - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: 'swagger/user.yaml#/components/schemas/User'
 *      responses:
 *       '200':
 *          description: 유저 수정 성공
 */
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    userController.updateUserById(req, res, next);
  }
);

/**
 * @swagger
 *  /api/users/:userId:
 *    delete:
 *      tags:
 *      - user
 *      description: 유저 삭제(탈퇴)
 *      produces:
 *      - application/json
 *      requestBody:
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: 'swagger/user.yaml#/components/schemas/User'
 *      responses:
 *       '200':
 *          description: 유저 삭제 성공
 */
userRouter.delete(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    userController.delUserById(req, res, next);
  }
);

// 현재 유저 정보을 가져옴
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
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
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.put(
  '/:userId',
  /*loginRequired,*/ async function (req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요'
        );
      }

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
      // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요'
        );
      }

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
