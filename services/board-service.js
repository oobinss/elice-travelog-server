import { boardModel } from '../db/index.js';

class BoardService {
  constructor(boardModel) {
    this.boardModel = boardModel;
  }

  async getComments() {
    const comments = await this.boardModel.findAll();
    return comments;
  }

  async addComment(commentInfo) {
    const createdComment = await this.boardModel.create(commentInfo);
    return createdComment;
  }

  async getCommentById(commentId) {
    const comments = await this.boardModel.findById(commentId);
    return comments;
  }

  async getCommentsByPostId(postId) {
    const comments = await this.boardModel.findByPostId(postId);
    return comments;
  }

  async delComment(commentId) {
    const count = await this.boardModel.deleteOne(commentId);
    return count;
  }

  //   async getBookmarkFolders(userId) {
  //     const folders = await this.bookmarkModel.findFoldersByUserId(userId);
  //     return folders;
  //   }

  //   async getBookmarksByUserId(userId) {
  //     const bookmarks = await this.bookmarkModel.findByUserId(userId);
  //     return bookmarks;
  //   }

  //   async getBookmarksByFolder(userId, bookmarkName) {
  //     const bookmarks = await this.bookmarkModel.findByFolder(
  //       userId,
  //       bookmarkName
  //     );
  //     return bookmarks;
  //   }

  //   async delBookmarks(userId, bookmarkIds) {
  //     const count = await this.bookmarkModel.deleteById({
  //       userId,
  //       bookmarkIds,
  //     });
  //     return count;
  //   }

  //   async updateFolderName(userId, bookmarkName, newBookmarkName) {
  //     const count = await this.bookmarkModel.updateFolderName({
  //       userId,
  //       bookmarkName,
  //       newBookmarkName,
  //     });
  //     return count;
  //   }

  //   async updateBookmarkMemo(userId, id, bookmarkMemo) {
  //     try {
  //       const bookmarks = await this.bookmarkModel.isMyBookmark({
  //         userId,
  //         id,
  //       });
  //       if (bookmarks) {
  //         const count = await this.bookmarkModel.updateBookmarkMemo({
  //           id,
  //           bookmarkMemo,
  //         });
  //         return count;
  //       }
  //       return bookmarks;
  //     } catch (error) {
  //       console.log(error);
  //       return '해당 북마크가 존재하지 않거나 접근 권한이 없습니다.';
  //     }
  //   }
}

const boardService = new BoardService(boardModel);

export { boardService };
