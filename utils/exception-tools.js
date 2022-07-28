function isHeaderJSON(reqBody) {
  if (is.emptyObject(reqBody)) {
    return res.status(400).send({
      error: 'headers의 Content-Type을 application/json으로 설정해주세요',
    });
  }
}

export { isHeaderJSON };
