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

function getYear() {
  const KEY_YEAR = "vlw_year";
  if (checkStorage()) {
    let year = localStorage.getItem(KEY_YEAR);
    if (year) {
      return year;
    }
  }
  return new Date().getFullYear();
}
function setYear(year) {
  const KEY_YEAR = "vlw_year";
  if (checkStorage()) {
    localStorage.setItem(KEY_YEAR, year);
  }
}

const CacheManager = {
  getAuthor,
  setAuthor,
  getYear,
  setYear,
};

export default CacheManager;
