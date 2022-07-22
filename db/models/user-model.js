import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserModel {
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

  async delete({ userId }) {
    const delUser = prisma.User.delete({
      where: { id: userId },
    });

    const delPost = prisma.Post.deleteMany({
      where: { userId: userId },
    });

    await prisma.$transaction([delPost, delUser]);
  }

  async update({ userId, updateVal }) {
    console.log(updateVal);
    await prisma.User.update({
      where: { id: userId },
      data: updateVal,
    });
  }
}

const userModel = new UserModel();

export { userModel };
