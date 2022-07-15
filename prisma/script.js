import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUsers = await prisma.User.findMany();

const createUser = await prisma.User.create({
  data: { email: 'email@gmail.com', nickname: 'hi', role: 'user', age: 20 },
});
