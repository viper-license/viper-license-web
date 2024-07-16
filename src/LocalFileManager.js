function checkStorage() {
  return typeof Storage !== "undefined";
}

function fetchLocalFile(key) {
  if (checkStorage()) {
    let data = localStorage.getItem(key);
    if (data) {
      return data;
    }
  }
  return null;
}

function saveLocalFile(key, data) {
  if (checkStorage()) {
    localStorage.setItem(key, data);
  }
}

const LocalFileManager = {
  fetchLocalFile,
  saveLocalFile,
};

export default LocalFileManager;
