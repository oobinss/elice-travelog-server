import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as KakaoStrategy } from 'paspport-kakao';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
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

// passport.use(
//   new KakaoStrategy(
//     {
//       clientID: clientID,
//       clientSecret: clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
//       callbackURL: callbackURL,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // 사용자의 정보는 profile에 들어있다.
//       User.findOrCreate(
//         ...(err, user) => {
//           if (err) {
//             return done(err);
//           }
//           return done(null, user);
//         }
//       );
//     }
//   )
// );

export default { passport };
