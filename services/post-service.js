import { postModel } from '../db/index.js';

class PostService {
  constructor(postModel) {
    this.postModel = postModel;
  }
  async addPost(res, postInfo) {
    const createdNewPost = await this.postModel.create(postInfo);

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌 (프론트에서 안 쓸 수 있지만, 편의상 보냄)
    res.status(201).json(createdNewPost);
  }
}
const postService = new PostService(postModel);

export { postService };
