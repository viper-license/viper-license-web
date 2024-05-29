const fs = require("fs");
const path = require("path");
const licenses = require("./license_urls.js");

const createFileIsNotExists = (fp) => {
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, "TODO", { encoding: "utf-8" });
  }
};

const runMain = (argv) => {
  const generated = [];
  for (let item of licenses) {
    const headerF = `/headers/${item.id}.txt`;
    const licenseF = `/licenses/${item.id}.txt`;
    createFileIsNotExists(
      path.join(__dirname, "../public/resources" + headerF)
    );
    createFileIsNotExists(
      path.join(__dirname, "../public/resources" + licenseF)
    );
    generated.push({
      id: item.id,
      name: item.fullName,
      short: item.shortName,
      header: headerF,
      full: licenseF,
      url: item.url ? item.url : item.web_url,
    });
  }
  fs.writeFileSync(
    path.join(__dirname, "../public/resources/licenses.json"),
    JSON.stringify(generated, null, 2),
    { encoding: "utf-8" }
  );
};

runMain(process.argv.slice(2));
