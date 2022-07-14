import 'dotenv/config';
import passport from 'passport';

// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const MicrosoftStrategy = require("passport-google-oauth20").Strategy;
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../db/models/user-model.js';

function auth(req, res, next) {
  let passportConfig = {
    emailField: 'email',
    passwordField: 'password',
    session: false,
  };

  const passportLoginVerify = async (username, password, done) => {
    try {
      console.log('LocalStrategy', username, password);

      // email check
      const user = await userModel.findById(email);

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
  };

  passport.use('local', new LocalStrategy(passportConfig, passportLoginVerify));
  next();
}

export { auth };
