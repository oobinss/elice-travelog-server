import { userModel } from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async addUser(res, userInfo) {
    const { email, password, name, nickname, address, role, age } = userInfo;

    const user = await this.userModel.findByEmail(email);
    if (user) {
      return res.status(404).send({
        error: '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
        email: email,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      email,
      password: hashedPassword,
      name,
      nickname,
      address,
      role,
      age,
    };

    const createdNewUser = await this.userModel.create(newUserInfo);

    res.status(201).json(createdNewUser);
  }

  async getUserToken(res, email, password) {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      return res.status(404).send({
        error: '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    const correctPasswordHash = user.password;
    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있던 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );
    if (!isPasswordCorrect) {
      return res.status(400).send({
        error: '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
      });
    }

    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);

    return { token, userId: user.id };
  }

  // 비밀번호 체크
  async checkPassword(currentPassword, users) {
    const correctPasswordHash = users.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    return isPasswordCorrect;
  }

  // 소셜 로그인에 토큰 발급
  async getSocialUserToken(email, res) {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);
    return token;
  }

  // 사용자 목록
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  // 사용자 1명
  async getUser(userId) {
    const users = await this.userModel.findById(userId);
    return users;
  }

  // 유저정보 수정 (현재 비밀번호 필수)
  async setUser(userId, toUpdate, res) {
    let user = await this.userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        error: '가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    const { password } = toUpdate;
    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    const updatedUser = await this.userModel.update({
      userId,
      updateVal: toUpdate,
    });

    res.status(200).json('OK');
  }

  // 유저정보중 주소와,연락처 수정,비밀번호값없이 변경할수있는 점이 유저정보수정과 다름
  async setUserAddress(userInfoRequired, toUpdate) {
    console.log('uiidfd');
    const { userId } = userInfoRequired;

    let user = await this.userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        error: '가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }

  // 유저정보 삭제(탈퇴), 현재 비밀번호가 있어야 삭제 가능함.
  async deleteUser(res, userId, currentPassword) {
    let user = await this.userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        error: '가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    // 이제, 정보 삭제(탈퇴)를 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      return res.status(400).send({
        error: '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
      });
    }

    user = await this.userModel.delete({
      userId,
    });
    res.status(200).json('OK');
  }

  // email로 userId를 받음.objectId를 문자열로 변환
  async getUserId(email) {
    const { _id } = await this.userModel.findByEmail(email);
    const UserId = _id;
    return UserId;
  }

  // 일반유저의 권한을 관리 권한으로 변경
  async setRole(userEmail) {
    let user = await this.userModel.findByEmail(userEmail);

    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    if (user.role === 'admin') {
      throw new Error('변경전(관리자)과 변경후(관리자)의 권한이 같습니다.');
    }
    const toUpdate = await { role: 'admin' };

    const userId = user._id;
    const setRoleUser = await this.userModel.update({
      userId,
      update: toUpdate,
    });
    const { _id, email, fullName, role, createdAt } = setRoleUser;
    const result = { _id, email, fullName, role, createdAt };

    return result;
  }

  // userId로 사용자 정보를 받음.
  async getUserInfo(userId) {
    const users = await this.userModel.findById(userId);
    return users;
  }

  // 카카오토큰이 getUserbyEmail에 있으면 로그인토큰발급
  async getUserTokenByEmail(kakaoId) {
    let user = await this.userModel.findByEmail(kakaoId);
    // 없으면 회원가입
    if (!user) {
      await this.addSocialUser(kakaoId);
      user = await this.userModel.findByEmail(kakaoId);
    }
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);

    return { token, userId: user.id };
  }

  async addSocialUser(kakaoToken) {
    // 이메일 중복은 이제 아니므로, 회원가입을 진행함
    const newUserInfo = {
      email: kakaoToken,
    };
    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }
}

const userService = new UserService(userModel);

export { userService };
