import { bookmarkModel } from '../db/index.js';

class BookmarkService {
  constructor(bookmarkModel) {
    this.bookmarkModel = bookmarkModel;
  }
  async addBookmark(bookmarkInfo) {
    const createdNewBookmark = await this.bookmarkModel.create(bookmarkInfo);
    return createdNewBookmark;
  }

  async addBookmarks(inputArray) {
    const createdNewBookmark = await this.bookmarkModel.createMany(inputArray);
    return createdNewBookmark;
  }

  async getBookmarkFolders(userId) {
    const folders = await this.bookmarkModel.findFoldersByUserId(userId);
    return folders;
  }

  async getBookmarksByUserId(userId) {
    const bookmarks = await this.bookmarkModel.findByUserId(userId);
    return bookmarks;
  }

  async getBookmarksByFolder(userId, bookmarkName) {
    const bookmarks = await this.bookmarkModel.findByFolder(
      userId,
      bookmarkName
    );
    return bookmarks;
  }

  async delFolder(userId, bookmarkName) {
    const deletedFolder = await this.bookmarkModel.deleteByFolder({
      userId,
      bookmarkName,
    });
    return 'OK';
  }

  async delBookmarks(userId, bookmarkIds) {
    const cnt = await this.bookmarkModel.deleteById({
      userId,
      bookmarkIds,
    });
    return cnt;
  }

  async updateFolderName(userId, bookmarkName, newBookmarkName) {
    const cnt = await this.bookmarkModel.updateFolderName({
      userId,
      bookmarkName,
      newBookmarkName,
    });
    return cnt;
  }

  async updateBookmarkMemo(userId, id, bookmarkMemo) {
    try {
      const bookmarks = await this.bookmarkModel.isMyBookmark({
        userId,
        id,
      });
      if (bookmarks) {
        const cnt = await this.bookmarkModel.updateBookmarkMemo({
          id,
          bookmarkMemo,
        });
        return cnt;
      }
      return bookmarks;
    } catch (error) {
      console.log(error);
      return '해당 북마크가 존재하지 않거나 접근 권한이 없습니다.';
    }
  }
}

const bookmarkService = new BookmarkService(bookmarkModel);

export { bookmarkService };
