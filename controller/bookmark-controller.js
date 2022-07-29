import { bookmarkService, postService } from '../services/index.js';
import * as tools from '../utils/exception-tools.js';

const addBookmark = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const {
      bookmarkName,
      bookmarkMemo,
      placeName,
      placeUrl,
      categoryName,
      addressName,
      roadAddressName,
      bookmarkId,
      phone,
      categoryGroupCode,
      categoryGroupName,
      x,
      y,
    } = req.body;

    const bookmarkInfo = {
      bookmarkName,
      bookmarkMemo,
      placeName,
      placeUrl,
      categoryName,
      addressName,
      roadAddressName,
      bookmarkId,
      phone,
      categoryGroupCode,
      categoryGroupName,
      x,
      y,
      userId,
    };

    const post = await bookmarkService.addBookmark(bookmarkInfo);
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
  }
};

const addBookmarks = async (req, res, next) => {
  try {
    tools.isHeaderJSON(req.body);

    const userId = req.user.id;
    const bookmarkName = req.body.bookmarkName;
    const inputArray = req.body.data;

    inputArray.forEach((element) => {
      element.bookmarkName = bookmarkName;
      element.userId = userId;
    });

    const bookmark = await bookmarkService.addBookmarks(inputArray);
    res.status(201).json(bookmark);
  } catch (error) {
    console.log(error);
  }
};

const getBookmarkName = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const folders = await bookmarkService.getBookmarkFolders(userId);
    res.status(201).json(folders);
  } catch (error) {
    console.log(error);
  }
};

const getBookmarksByFolder = async (req, res, next) => {
  try {
    const userId = req.user.id;
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

const getBookmarksByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await bookmarkService.getBookmarksByUserId(userId);
    res.status(201).json(bookmarks);
  } catch (error) {
    console.log(error);
  }
};

const delFolder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarkName = req.params.folderName;

    const bookmarks = await bookmarkService.delFolder(userId, bookmarkName);
    res.status(201).json(bookmarks);
  } catch (error) {
    console.log(error);
  }
};

const delBookmarks = async (req, res, next) => {
  try {
    const bookmarkId = req.body.id;

    const count = await bookmarkService.delBookmark(bookmarkId);
    res.status(201).json(count);
  } catch (error) {
    console.log(error);
  }
};

const updateFolderName = async (req, res, next) => {
  try {
    const userId = req.user.id;
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
    const userId = req.user.id;
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

export {
  addBookmark,
  addBookmarks,
  getBookmarkName,
  getBookmarksByFolder,
  getBookmarksByUser,
  delFolder,
  delBookmarks,
  updateFolderName,
  updateBookmarkMemo,
};
