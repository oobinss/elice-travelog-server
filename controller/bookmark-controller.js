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

    let resMessage = '';
    let resArray = [];
    for (let i = 0; i < req.body.data.length; i++) {
      const {
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
      } = req.body.data[i];

      console.log(
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
        userId
      );

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

      const bookmark = await bookmarkService.addBookmark(bookmarkInfo);
      resArray.push(bookmark);
    }
    // const post = await bookmarkService.addBookmark(postInfo);
    res.status(201).json(resArray);
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

export {
  addBookmark,
  addBookmarks,
  getBookmarkName,
  getBookmarksByFolder,
  getBookmarksByUser,
};
