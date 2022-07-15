// import mongoose from 'mongoose';
// const { model } = mongoose;

// import { UserSchema } from '../schemas/user-schema.js';

// const User = model('users', UserSchema);

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserModel {
  //prisma//////////////////////////////////////////////////
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

  //mongoDB//////////////////////////////////////////////////
  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

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
