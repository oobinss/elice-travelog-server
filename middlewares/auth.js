import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
// import { Prisma } from '@prisma/client';
import { userService } from '../services/index.js';
import { userModel } from '../db/models/user-model.js';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});
/*
// passport.js LocalStrategy 사용하는 경우 (+session)
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    // callback function
    async function (username, password, done) {
      try {
        console.log('LocalStrategy', username, password);

        // email check
        const user = await userModel.findByEmail(username);

        if (!user) {
          return done(null, false, { message: `존재하지 않는 사용자입니다.` });
        }

        // password check
        const compareResult = await bcrypt.compare(password, user.password);
        if (compareResult) {
          return done(null, user);
        }
        return done(null, false, { reason: '올바르지 않은 비밀번호 입니다.' });
      } catch (e) {
        console.log(e);
        done(e);
      }
    }
  )
);
*/
// JwtStrategy
passport.use(
  new JwtStrategy(
    {
      // header에 bearer스키마에 담겨온 토큰 해석할 것
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 해당 복호화 방법사용
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    // callback function
    async function (jwtPayload, done) {
      try {
        console.log(jwtPayload);
        const user = await userModel.findById(jwtPayload.userId);

        // user가 있을 경우
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// const prisma = new PrismaClient();

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: '', // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL: '/api/users/kakao/callback',
    },
    /**
     * clientID에 카카오 앱 아이디 추가
     * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
     * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
     * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
     */
    async (accessToken, refreshToken, profile, done) => {
      console.log('kakao profile', profile);
      try {
        const strProfileId = String(profile.id);
        const kakaoUser = await userModel.findByEmail(strProfileId);

        // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
        // 이미 가입된 카카오 프로필이면 성공
        if (kakaoUser) {
          done(null, kakaoUser); // 로그인 인증 완료
        } else {
          // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
          const newUser = await userModel.create({
            email: strProfileId,
          });
          done(null, newUser); // 회원가입하고 로그인 인증 완료
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

export default { passport };
