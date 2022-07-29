import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { userService } from '../services/index.js';
import { userModel } from '../db/models/user-model.js';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    async function (jwtPayload, done) {
      try {
        console.log(jwtPayload);
        const user = await userModel.findById(jwtPayload.userId);

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

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: '',
      callbackURL: '/api/users/kakao/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('kakao profile', profile);
      try {
        const strProfileId = String(profile.id);
        const kakaoUser = await userModel.findByEmail(strProfileId);

        if (kakaoUser) {
          done(null, kakaoUser);
        } else {
          const newUser = await userModel.create({ email: strProfileId });
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

export default { passport };
