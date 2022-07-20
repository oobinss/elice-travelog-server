import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PostModel {
  async findAll() {
    const posts = await prisma.Post.findMany();
    return posts;
  }

  async create(postInfo) {
    console.log(postInfo);
    const createdNewPost = await prisma.Post.create({
      data: postInfo,
    });
    return createdNewPost;
  }

  async findByUserId(userId) {
    const posts = await prisma.Post.findUnique({
      where: { userId: userId },
    });
    return posts;
  }

  async findByPostId(postId) {
    const posts = await prisma.Post.findUnique({
      where: { id: postId },
    });
    return posts;
  }

  async delete({ postId }) {
    await prisma.Post.delete({
      where: { id: postId },
    });
  }

  async update({ postId, updateVal }) {
    console.log(updateVal);
    await prisma.Post.update({
      where: { id: postId },
      data: updateVal,
    });
  }
}

const postModel = new PostModel();

export { postModel };
