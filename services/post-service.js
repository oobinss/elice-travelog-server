import { postModel } from '../db/index.js';

class PostService {
  constructor(postModel) {
    this.postModel = postModel;
  }
  async addPost(postInfo) {
    const createdNewPost = await this.postModel.create(postInfo);
    return createdNewPost;
  }

  async getPostById(postId) {
    const post = await this.postModel.findById(postId);
    return post;
  }

  async getPostsByUserId(userId) {
    const posts = await this.postModel.findByUserId(userId);
    return posts;
  }

  async getPosts() {
    const posts = await this.postModel.findAll();
    return posts;
  }

  async delPost(postId) {
    const deletedPost = await this.postModel.delete({ postId });
    return 'OK';
  }
}
const postService = new PostService(postModel);

export { postService };
