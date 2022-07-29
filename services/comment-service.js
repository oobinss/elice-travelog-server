import { commentModel } from '../db/index.js';

class CommentService {
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  async getComments() {
    const comments = await this.commentModel.findAll();
    return comments;
  }

  async addComment(commentInfo) {
    const createdComment = await this.commentModel.create(commentInfo);
    return createdComment;
  }

  async getCommentById(commentId) {
    const comments = await this.commentModel.findById(commentId);
    return comments;
  }

  async getCommentsByPostId(postId) {
    const comments = await this.commentModel.findByPostId(postId);
    return comments;
  }

  async delComment(commentId) {
    const count = await this.commentModel.deleteOne(commentId);
    return count;
  }
}

const commentService = new CommentService(commentModel);

export { commentService };
