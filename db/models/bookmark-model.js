import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BookmarkModel {
  async create(bookmarkInfo) {
    const createdNewBookmark = await prisma.Bookmark.create({
      data: bookmarkInfo,
    });
    return createdNewBookmark;
  }

  async createMany(bookmarkInfos) {
    const createdNewBookmark = await prisma.Bookmark.createMany({
      data: bookmarkInfos,
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

  async deleteByFolder({ userId, bookmarkName }) {
    await prisma.Bookmark.deleteMany({
      where: {
        AND: [{ userId: userId }, { bookmarkName: bookmarkName }],
      },
    });
  }

  async deleteById({ bookmarkId }) {
    const count = await prisma.Bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return count;
  }

  async updateFolderName({ userId, bookmarkName, newBookmarkName }) {
    const count = await prisma.Bookmark.updateMany({
      where: {
        AND: [{ userId: userId }, { bookmarkName: bookmarkName }],
      },
      data: { bookmarkName: newBookmarkName },
    });
    return count;
  }

  async isMyBookmark({ userId, id }) {
    const bookmarks = await prisma.Bookmark.findMany({
      where: {
        AND: [{ id: id }, { userId: userId }],
      },
    });
    return bookmarks;
  }

  async updateBookmarkMemo({ id, bookmarkMemo }) {
    const count = await prisma.Bookmark.update({
      where: {
        id: id,
      },
      data: { bookmarkMemo: bookmarkMemo },
    });
    return count;
  }
}

const bookmarkModel = new BookmarkModel();

export { bookmarkModel };
