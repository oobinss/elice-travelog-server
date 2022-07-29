import { commentService } from '../services/index.js';
import * as tools from '../utils/exception-tools.js';

const addComment = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const userId = req.user.id;
    const postId = Number(req.params.postId);
    const { content } = req.body;

    const commentInfo = {
      content,
      postId,
      userId,
    };

    const comment = await commentService.addComment(commentInfo);
    res.status(201).json(comment);
  } catch (error) {
    console.log(error);
  }
};

const getCommentsByPostId = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);

    const comments = await commentService.getCommentsByPostId(postId);
    console.log(comments);
    res.status(201).json(comments);
  } catch (error) {
    console.log(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getComments();
    res.status(201).json(comments);
  } catch (error) {
    console.log(error);
  }
};

const delComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const commentId = Number(req.params.commentId);
    const comment = await commentService.getCommentById(commentId);

    let count = 0;
    if (userId == comment.userId) {
      count = await commentService.delComment(commentId);
    } else {
      res.status(404).json({ errorMessage: '접근 권한이 없습니다.' });
    }
    res.status(201).json({ count });
  } catch (error) {
    console.log(error);
  }
};

export { addComment, getComments, getCommentsByPostId, delComment };
