import { userModel } from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async addUser(res, userInfo) {
    // 객체 destructuring
    const { email, password, name, nickname, address, role, age } = userInfo;

    // 이메일 중복 확인
    const user = await this.userModel.findByEmail(email);
    if (user) {
      return res.status(404).send({
        error: '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
        email: email,
      });
    }

    // 이메일 중복은 이제 아니므로, 회원가입을 진행함
    // 우선 비밀번호 해쉬화(암호화)
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

    // db에 저장
    const createdNewUser = await this.userModel.create(newUserInfo);

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌 (프론트에서 안 쓸 수 있지만, 편의상 보냄)
    res.status(201).json(createdNewUser);
  }

  // 로그인
  async getUserToken(res, email, password) {
    // 이메일이 db에 존재하는지 확인
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      return res.status(404).send({
        error: '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    // 비밀번호 일치 여부 확인
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

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);
    // const token = jwt.sign({ userId: user.email }, secretKey);

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
  async setUser(userInfoRequired, toUpdate, res) {
    const { userId, currentPassword } = userInfoRequired;

    // 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        error: '가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    // 비밀번호 일치 여부 확인
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

    // 업데이트 시작 (비밀번호 변경시 해쉬화 필수)
    const { password } = toUpdate;
    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    const updatedUser = await this.userModel.update({
      userId,
      updateVal: toUpdate,
    });

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json('OK');
  }

  // 유저정보중 주소와,연락처 수정,비밀번호값없이 변경할수있는 점이 유저정보수정과 다름
  async setUserAddress(userInfoRequired, toUpdate) {
    // 객체 destructuring
    const { userId } = userInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      return res.status(404).send({
        error: '가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    // 이제 주소와,연락처 정보 변경 시작
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }

  // 유저정보 삭제(탈퇴), 현재 비밀번호가 있어야 삭제 가능함.
  async deleteUser(res, userId, currentPassword) {
    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      return res.status(404).send({
        error: '가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    // 이제, 정보 삭제(탈퇴)를 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 비밀번호 일치 여부 확인
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

    //삭제(탈퇴) 시작
    user = await this.userModel.delete({
      userId,
    });
    // return user;
    res.status(200).json('OK');
  }

  // email로 userId를 받음.objectId를 문자열로 변환
  async getUserId(email) {
    const { _id } = await this.userModel.findByEmail(email);
    // const UserId = _id.toString();
    const UserId = _id;
    return UserId;
  }

  // 일반유저의 권한을 관리 권한으로 변경
  async setRole(userEmail) {
    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findByEmail(userEmail);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    if (user.role === 'admin') {
      throw new Error('변경전(관리자)과 변경후(관리자)의 권한이 같습니다.');
    }
    const toUpdate = await { role: 'admin' };

    const userId = user._id;
    // 이제 주소와,연락처 정보 변경 시작
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
  // 없으면 회원가입
  async getUserTokenByEmail(kakaoToken) {
    let user = await this.userModel.findByEmail(kakaoToken);
    // 없으면 회원가입
    if (!user) {
      await this.addSocialUser(kakaoToken);
      user = await this.userModel.findByEmail(kakaoToken);
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);

    return token;
  }

  async addSocialUser(kakaoToken) {
    // 이메일 중복은 이제 아니므로, 회원가입을 진행함
    const newUserInfo = {
      email: kakaoToken,
    };

    // db에 저장
    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }
}

const userService = new UserService(userModel);

export { userService };
