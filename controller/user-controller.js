import { userService } from '../services/index.js';
import is from '@sindresorhus/is';

class UserController {
  // 본 파일의 맨 아래에서, new UserController(userService) 하면, 이 함수의 인자로 전달됨
  constructor(userService) {
    this.userModel = userService;
  }

  async addUser(req, res, next) {
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
  }
}

const userController = new UserController();

export { userController };
