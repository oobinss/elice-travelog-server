import { userService } from '../services/index.js';
import * as tools from '../utils/exception-tools.js';

const addUser = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const { email, password, name, nickname, address, role, age } = req.body;

    const userInfo = {
      email,
      password,
      name,
      nickname,
      address,
      role,
      age,
    };
    await userService.addUser(res, userInfo);
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, userId } = await userService.getUserToken(
      res,
      email,
      password
    );

    res.status(200).json({ token, userId });
  } catch (error) {
    console.log(error);
  }
};

const userPasswordCheck = async (req, res, next) => {
  try {
    const { password } = req.body;
    const users = await userService.getUser(req.user.id);

    const isPassword = await userService.checkPassword(password, users);

    res.status(200).json({ isPassword });
  } catch (error) {
    console.log(error);
  }
};

const socialLoginToken = async (req, res) => {
  try {
    const userEmail = String(req.body.data.data.id);
    const { token, userId } = await userService.getUserTokenByEmail(userEmail);
    res.status(200).json({ token, userId });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const users = await userService.getUser(userId);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const delUserById = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const password = req.body.password;

    if (!password) {
      return res.status(400).send({
        error: '회원정보 삭제를 위해, 현재의 비밀번호가 필요합니다.',
      });
    }

    await userService.deleteUser(res, userId, password);
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const userId = Number(req.params.userId);
    const {
      email,
      password,
      name,
      nickname,
      phoneNumber,
      address,
      role,
      age,
      profileImg,
      profileText,
    } = req.body;

    const toUpdate = {
      ...(email && { email }),
      ...(password && { password }),
      ...(name && { name }),
      ...(nickname && { nickname }),
      ...(phoneNumber && { phoneNumber }),
      ...(address && { address }),
      ...(role && { role }),
      ...(age && { age }),
      ...(profileImg && { profileImg }),
      ...(profileText && { profileText }),
    };

    await userService.setUser(userId, toUpdate, res);
  } catch (error) {
    next(error);
  }
};

export {
  addUser,
  userLogin,
  userPasswordCheck,
  socialLoginToken,
  getUsers,
  getUser,
  delUserById,
  updateUserById,
};
