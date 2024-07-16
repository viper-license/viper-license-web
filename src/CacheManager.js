function checkStorage() {
  return typeof Storage !== "undefined";
}

function getAuthor() {
  const KEY_AUTHOR = "vlw_author";
  if (checkStorage()) {
    let author = localStorage.getItem(KEY_AUTHOR);
    if (author) {
      return author;
    }
  }
  return "mylhyz";
}

function setAuthor(author) {
  const KEY_AUTHOR = "vlw_author";
  if (checkStorage()) {
    localStorage.setItem(KEY_AUTHOR, author);
  }
}

const CacheManager = {
  checkStorage,
  getAuthor,
  setAuthor,
};

export default CacheManager;
