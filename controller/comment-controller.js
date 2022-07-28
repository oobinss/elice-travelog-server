import { commentService } from '../services/index.js';
import * as tools from '../utils/exception-tools.js';

const addComment = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
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
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const postId = Number(req.params.postId);

    const folders = await bookmarkService.getBookmarkFolders(userId);
    res.status(201).json(folders);
  } catch (error) {
    console.log(error);
  }
};

const getBookmarksByFolder = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const bookmarkName = req.params.folderName;
    const bookmarks = await bookmarkService.getBookmarksByFolder(
      userId,
      bookmarkName
    );
    res.status(201).json(bookmarks);
  } catch (error) {
    console.log(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    // const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const comments = await commentService.getComments();
    res.status(201).json(comments);
  } catch (error) {
    console.log(error);
  }
};

const delFolder = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const bookmarkName = req.params.folderName;

    const bookmarks = await bookmarkService.delFolder(userId, bookmarkName);
    res.status(201).json(bookmarks);
  } catch (error) {
    console.log(error);
  }
};

const delBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const bookmarkIds = req.body.data;

    const count = await bookmarkService.delBookmarks(userId, bookmarkIds);
    res.status(201).json(count);
  } catch (error) {
    console.log(error);
  }
};

const updateFolderName = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const { bookmarkName, newBookmarkName } = req.body;

    const count = await bookmarkService.updateFolderName(
      userId,
      bookmarkName,
      newBookmarkName
    );
    res.status(201).json(count);
  } catch (error) {
    console.log(error);
  }
};

const updateBookmarkMemo = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const { id, bookmarkMemo } = req.body;

    const count = await bookmarkService.updateBookmarkMemo(
      userId,
      id,
      bookmarkMemo
    );
    res.status(201).json(count);
  } catch (error) {
    console.log(error);
  }
};

export { addComment, getComments, getCommentsByPostId };
