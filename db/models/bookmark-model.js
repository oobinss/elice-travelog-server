import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BookmarkModel {
  //   async findAll() {
  //     const posts = await prisma.Post.findMany();
  //     return posts;
  //   }
  //   async create(postInfo) {
  //     console.log(postInfo);
  //     const createdNewPost = await prisma.Post.create({
  //       data: postInfo,
  //     });
  //     return createdNewPost;
  //   }
  //   async findById(postId) {
  //     const post = await prisma.Post.findUnique({
  //       where: { id: postId },
  //     });
  //     return post;
  //   }
  //   async findByUserId(userId) {
  //     const posts = await prisma.Post.findMany({
  //       where: { userId: userId },
  //     });
  //     return posts;
  //   }
  //   async delete({ postId }) {
  //     await prisma.Post.delete({
  //       where: { id: postId },
  //     });
  //   }
  //   async update({ postId, updateVal }) {
  //     console.log(updateVal);
  //     await prisma.Post.update({
  //       where: { id: postId },
  //       data: updateVal,
  //     });
  //   }
}

const bookmarkModel = new BookmarkModel();

export { bookmarkModel };
