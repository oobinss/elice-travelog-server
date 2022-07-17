import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserModel {
  //mysql-prismaORM//////////////////////////////////////////////////
  async findAll() {
    const users = await prisma.User.findMany();
    return users;
  }

  async findByEmail(email) {
    const user = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await prisma.User.create({
      data: userInfo,
    });
    return createdNewUser;
  }

  async findById(userId) {
    const user = await prisma.User.findUnique({
      where: { id: userId },
    });
    return user;
  }

  //mongoDB//////////////////////////////////////////////////
  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  async delete({ userId }) {
    const filter = { _id: userId };

    const deleteUser = await User.findOneAndRemove(filter);
    return deleteUser;
  }
}

const userModel = new UserModel();

export { userModel };
