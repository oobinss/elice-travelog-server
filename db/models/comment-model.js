import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CommentModel {
  async findAll() {
    const comments = await prisma.Comment.findMany();
    return comments;
  }
  async create(commentInfo) {
    const createdNewComment = await prisma.Comment.create({
      data: commentInfo,
    });
    return createdNewComment;
  }

  async findById(commentId) {
    const comments = await prisma.Comment.findUnique({
      where: { id: commentId },
    });
    return comments;
  }

  async findByPostId(postId) {
    const comments = await prisma.Comment.findMany({
      where: { postId: postId },
      include: {
        // TODO: user-comment 테이블의 FK제거 후 하단 코드 이용 가능?
        // Post: {
        //   select: {
        //     User: {
        //       select: {
        //         nickname: true,
        //         profileImg: true,
        //       },
        //     },
        //   },
        // },

        User: {
          select: {
            nickname: true,
            profileImg: true,
          },
        },
      },
      orderBy: { createAt: 'asc' },
    });
    return comments;
  }

  async deleteOne(commentId) {
    const count = await prisma.Comment.delete({
      where: {
        id: commentId,
      },
    });
    return count;
  }
}

const commentModel = new CommentModel();

export { commentModel };
