import { bookmarkModel } from '../db/index.js';

class BookmarkService {
  constructor(bookmarkModel) {
    this.bookmarkModel = bookmarkModel;
  }
  async addBookmark(bookmarkInfo) {
    const createdNewPost = await this.bookmarkModel.create(bookmarkInfo);
    return createdNewPost;
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

  //   async getPostById(postId) {
  //     const post = await this.postModel.findById(postId);
  //     return post;
  //   }

  //   async getPosts() {
  //     const posts = await this.postModel.findAll();
  //     return posts;
  //   }

  //   async delPost(postId) {
  //     const deletedPost = await this.postModel.delete({ postId });
  //     return 'OK';
  //   }
}
const bookmarkService = new BookmarkService(bookmarkModel);

export { bookmarkService };
