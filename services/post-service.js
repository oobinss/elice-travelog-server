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

  async setPost(postId, toUpdate, res) {
    let post = await this.postModel.findById(postId);
    if (!post) {
      return res.status(404).send({
        error: '해당되는 글이 없습니다. 다시 한 번 확인해 주세요.',
      });
    }

    // 업데이트 진행
    const updatedPost = await this.postModel.update({
      postId,
      updateVal: toUpdate,
    });
  }

  async delPost(postId) {
    const deletedPost = await this.postModel.delete({ postId });
    return 'OK';
  }

  async getPostsByUserId(userId) {
    const posts = await this.postModel.findByUserId(userId);
    return posts;
  }

  async getPostsByCreate(type) {
    const posts = await this.postModel.findByCreate(type);
    return posts;
  }
}
const postService = new PostService(postModel);

export { postService };
