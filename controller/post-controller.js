import { postService } from '../services/index.js';
import * as tools from '../utils/exception-tools.js';

const addPost = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const userId = req.user.id;
    const {
      title,
      content,
      mainImg,
      flagHideYN,
      markedData,
      cateCity,
      tag,
      type,
    } = req.body;

    const postInfo = {
      userId,

      title,
      content,
      mainImg,
      flagHideYN,
      markedData,
      cateCity,
      tag,
      type,
    };

    const post = await postService.addPost(postInfo);
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    console.log(postId);
    const post = await postService.getPostById(postId);
    console.log(post);
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
  }
};

const getPostsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const posts = await postService.getPostsByUserId(userId);
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const postId = Number(req.postId);
    const posts = await postService.getPosts(postId);
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
  }
};

const updatePostById = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const postId = Number(req.params.postId);
    const { title, content, mainImg, flagHideYN, markedData, cateCity, tag } =
      req.body;

    const toUpdate = {
      ...(title && { title }),
      ...(content && { content }),
      ...(mainImg && { mainImg }),
      ...(flagHideYN && { flagHideYN }),
      ...(markedData && { markedData }),
      ...(cateCity && { cateCity }),
      ...(tag && { tag }),
    };

    const updatedPostInfo = await postService.setPost(postId, toUpdate, res);
    res.status(200).json('OK');
  } catch (error) {
    next(error);
  }
};

const delPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    const cfMessage = await postService.delPost(postId);

    res.status(201).json(cfMessage);
  } catch (error) {
    console.log(error);
  }
};

const getPostsByCreate = async (req, res, next) => {
  try {
    const type = req.params.type;
    const posts = await postService.getPostsByCreate(type);
    res.status(201).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export {
  addPost,
  getPost,
  getPostsByCreate,
  getPostsByUserId,
  getPosts,
  updatePostById,
  delPost,
};
