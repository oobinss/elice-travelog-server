import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PostModel {
  async findAll() {
    const posts = await prisma.Post.findMany();
    return posts;
  }

  async create(postInfo) {
    const createdNewPost = await prisma.Post.create({
      data: postInfo,
    });
    return createdNewPost;
  }

  async findById(postId) {
    const post = await prisma.Post.findUnique({
      where: { id: postId },
      include: {
        User: {
          select: {
            nickname: true,
            profileImg: true,
          },
        },
      },
    });
    return post;
  }

  async findByUserId(userId) {
    const posts = await prisma.Post.findMany({
      where: { userId: userId },
    });
    return posts;
  }

  async delete({ postId }) {
    await prisma.Post.delete({
      where: { id: postId },
    });
  }

  async update({ postId, updateVal }) {
    await prisma.Post.update({
      where: { id: postId },
      data: updateVal,
    });
  }

  async findByCreate(type) {
    const posts = await prisma.Post.findMany({
      where: { flagHideYN: 'N', type: type },
      include: {
        User: {
          select: {
            nickname: true,
            profileImg: true,
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });

    return posts;
  }
}

const postModel = new PostModel();

export { postModel };
