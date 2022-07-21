import { bookmarkModel } from '../db/index.js';

class BookmarkService {
  constructor(bookmarkModel) {
    this.bookmarkModel = bookmarkModel;
  }
  async addBookmark(bookmarkInfo) {
    const createdNewPost = await this.bookmarkModel.create(bookmarkInfo);
    return createdNewPost;
  }

  //   async getPostById(postId) {
  //     const post = await this.postModel.findById(postId);
  //     return post;
  //   }

  //   async getPostsByUserId(userId) {
  //     const posts = await this.postModel.findByUserId(userId);
  //     return posts;
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
