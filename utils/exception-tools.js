import is from '@sindresorhus/is';

// Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
// application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
function isHeaderJSON(reqBody) {
  if (is.emptyObject(reqBody)) {
    return res.status(400).json({
      error: 'headers의 Content-Type을 application/json으로 설정해주세요',
    });
  }
}

export { isHeaderJSON };
