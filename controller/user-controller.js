import { userService } from '../services/index.js';
import is from '@sindresorhus/is';

const addUser = async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }
    const { email, password, name, nickname, address, role, age } = req.body;

    // 없으면 default값 지정
    const newUser = await userService.addUser({
      email,
      password,
      name,
      nickname,
      address,
      role,
      // ...(role || { role: 'user' }),
      age,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌 (프론트에서 안 쓸 수 있지만, 편의상 보냄)
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const token = await userService.getUserToken(req.body);

    // 로그인 진행 성공시 userId(문자열) 와 jwt 토큰(문자열)을 프론트에 보냄
    // res.status(200).json({ userId, token });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    // 전체 사용자 목록을 얻음
    // const userRole = await req.currentUserRole;
    // if (userRole !== 'admin') {
    //   console.log(`${userRole}의  회원목록조회 요청이 거부됨`);
    //   throw new Error('권한이 없습니다.');
    // }
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const delUserById = async (req, res, next) => {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    const userId = Number(req.params.userId);
    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함. (폼에서 현재비번 제출받음)
    const currentPassword = req.body.currentPassword;

    // currentPassword 없을 시, 진행 불가
    if (!currentPassword) {
      throw new Error('회원정보 삭제를 위해, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { userId, currentPassword };

    await userService.deleteUser(userInfoRequired);

    res.status(200).json('OK');
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    const userId = Number(req.params.userId);
    const {
      email,
      password,
      name,
      nickname,
      address,
      phoneNumber,
      role,
      age,
      currentPassword,
    } = req.body;

    if (!currentPassword) {
      throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
    }

    const userInfoRequired = { userId, currentPassword };

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(email && { email }),
      ...(password && { password }),
      ...(name && { name }),
      ...(nickname && { nickname }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
      ...(role && { role }),
      ...(age && { age }),
    };

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate
    );

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
};

export { addUser, userLogin, getUsers, delUserById, updateUserById };
