import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BookmarkModel {
  //   async findAll() {
  //     const posts = await prisma.Post.findMany();
  //     return posts;
  //   }
  async create(bookmarkInfo) {
    console.log(bookmarkInfo);
    const createdNewBookmark = await prisma.Bookmark.create({
      data: bookmarkInfo,
    });
    return createdNewBookmark;
  }
  async findFoldersByUserId(userId) {
    const folders = await prisma.Bookmark.findMany({
      where: { userId: userId },
      select: {
        bookmarkName: true,
      },
      distinct: ['bookmarkName'],
    });
    return folders;
  }

  async findByUserId(userId) {
    const bookmarks = await prisma.Bookmark.findMany({
      where: { userId: userId },
    });
    return bookmarks;
  }

  async findByFolder(userId, bookmarkName) {
    const bookmarks = await prisma.Bookmark.findMany({
      where: {
        AND: [{ userId: userId }, { bookmarkName: bookmarkName }],
      },
    });
    return bookmarks;
  }

  //   async findById(postId) {
  //     const post = await prisma.Post.findUnique({
  //       where: { id: postId },
  //     });
  //     return post;
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
