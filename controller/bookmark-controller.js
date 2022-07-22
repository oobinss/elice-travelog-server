import { bookmarkService, postService } from '../services/index.js';
import is from '@sindresorhus/is';

const addBookmark = async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      return res.status(400).send({
        error: 'headers의 Content-Type을 application/json으로 설정해주세요',
      });
    }
    //   console.log(req.user);
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
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      return res.status(400).send({
        error: 'headers의 Content-Type을 application/json으로 설정해주세요',
      });
    }
    //   console.log(req.user);
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
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
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
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

const getBookmarksByUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const bookmarks = await bookmarkService.getBookmarksByUserId(userId);
    res.status(201).json(bookmarks);
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

    const cnt = await bookmarkService.delBookmarks(userId, bookmarkIds);
    res.status(201).json(cnt);
  } catch (error) {
    console.log(error);
  }
};

const updateFolderName = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const { bookmarkName, newBookmarkName } = req.body;

    const cnt = await bookmarkService.updateFolderName(
      userId,
      bookmarkName,
      newBookmarkName
    );
    res.status(201).json(cnt);
  } catch (error) {
    console.log(error);
  }
};

const updateBookmarkMemo = async (req, res, next) => {
  try {
    const userId = req.user.id; // jwtStrategy에서 토큰을 복호화해 나온 userId로 user찾아옴
    const { id, bookmarkMemo } = req.body;

    const cnt = await bookmarkService.updateBookmarkMemo(
      userId,
      id,
      bookmarkMemo
    );
    res.status(201).json(cnt);
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
