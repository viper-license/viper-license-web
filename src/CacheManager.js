function checkStorage() {
  return typeof Storage !== "undefined";
}

function read(key, defaultValue) {
  if (checkStorage()) {
    let data = localStorage.getItem(key);
    if (data) {
      return data;
    }
  }
  return defaultValue;
}
function write(key, data) {
  if (checkStorage()) {
    localStorage.setItem(key, data);
  }
}

const KEY_AUTHOR = "vlw_author";

function readAuthor() {
  return read(KEY_AUTHOR, "mylhyz");
}

function saveAuthor(author) {
  write(KEY_AUTHOR, author);
}

const KEY_YEAR = "vlw_year";

function readYear() {
  return read(KEY_YEAR, new Date().getFullYear());
}
function saveYear(year) {
  write(KEY_YEAR, year);
}

const KEY_VERSION = "vlw_version";

function readVersion() {
  return read(KEY_VERSION);
}
function saveVersion(version) {
  write(KEY_VERSION, version);
}

const CacheManager = {
  readAuthor,
  saveAuthor,
  readYear,
  saveYear,
  readVersion,
  saveVersion,
};

export default CacheManager;
