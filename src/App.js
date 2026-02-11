import React, { useState, useEffect } from "react";
import i18next from "i18next";
import "./App.css";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";

import CacheManager from "./CacheManager";
import LocalFileManager from "./LocalFileManager";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8b5cf6",
    },
    secondary: {
      main: "#f472b6",
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h3: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            "&::before": {
              display: "none",
            },
            "&::after": {
              display: "none",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#6b7280",
            fontWeight: 500,
          },
          "& .MuiInputBase-input": {
            padding: "12px 16px",
            fontWeight: 500,
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "12px",
            "&::before": {
              display: "none",
            },
            "&::after": {
              display: "none",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "12px 16px",
          fontWeight: 500,
          minWidth: "140px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#6b7280",
          fontWeight: 500,
          "&.Mui-focused": {
            color: "#8b5cf6",
          },
        },
      },
    },
  },
});

function isCacheFirst() {
  return !global.isVersionUpdated;
}

function fetchFile(url) {
  let data = null;
  if (isCacheFirst()) {
    data = LocalFileManager.fetchLocalFile(url);
    if (data) {
      return Promise.resolve({
        json: () => {
          return Promise.resolve(JSON.parse(data));
        },
        text: () => {
          return Promise.resolve(data);
        },
      });
    }
  }
  return fetch(url).then(async (res) => {
    let copy = res.clone();
    let data = await copy.text();
    LocalFileManager.saveLocalFile(url, data);
    return res;
  });
}

function fetchSource() {
  return new Promise((resolve, reject) => {
    fetchFile(process.env.PUBLIC_URL + "/resources/licenses.json")
      .then((res) => res.json())
      .then(
        async (res) => {
          const sources = [];
          for (let item of res) {
            const { id, name, short, header, full } = item;
            const url1 = process.env.PUBLIC_URL + "/resources" + header;
            const url2 = process.env.PUBLIC_URL + "/resources" + full;
            let text1;
            try {
              let resp = await fetchFile(url1);
              text1 = await resp.text();
            } catch (e) {
              console.error(e);
            }
            let text2;
            try {
              let resp = await fetchFile(url2);
              text2 = await resp.text();
            } catch (e) {
              console.error(e);
            }
            sources.push({ id, name, short, header: text1, full: text2 });
          }
          resolve(sources);
        },
        (err) => {
          reject(err);
        }
      );
  });
}

function formatLicenseShortOut(text, info) {
  let yearPattern;
  let userPattern;
  let trimStart = false;
  if (info.id === "apache-2.0") {
    yearPattern = "[yyyy]";
    userPattern = "[name of copyright owner]";
    trimStart = true;
  } else if (info.id === "gpl-3.0") {
    yearPattern = "<year>";
    userPattern = "<name of author>";
    trimStart = true;
  } else if (info.id === "mit") {
    yearPattern = "[year]";
    userPattern = "[fullname]";
  } else if (info.id === "agpl-3.0") {
    yearPattern = "<year>";
    userPattern = "<name of author>";
    trimStart = true;
  }

  const lines = text.split("\n");
  const newLines = [];
  for (let line of lines) {
    if (trimStart) {
      line = line.trimStart();
      if (line !== "") {
        line = " " + line;
      }
    }
    if (yearPattern && userPattern) {
      let newLine = line;
      newLine = newLine.replace(yearPattern, info.year);
      newLine = newLine.replace(userPattern, info.user);
      newLines.push(newLine);
      continue;
    }
    newLines.push(line);
  }
  return newLines.join("\n");
}

function formatLicenseLargeOut(text, info) {
  let yearPattern;
  let userPattern;
  if (info.id === "mit") {
    yearPattern = "[year]";
    userPattern = "[fullname]";
  }

  const lines = text.split("\n");
  const newLines = [];
  for (let line of lines) {
    if (yearPattern && userPattern) {
      let newLine = line;
      newLine = newLine.replace(yearPattern, info.year);
      newLine = newLine.replace(userPattern, info.user);
      newLines.push(newLine);
      continue;
    }
    newLines.push(line);
  }
  return newLines.join("\n");
}

const generator = {
  quote: function (text) {
    const lines = text.split("\n");
    const newLines = [];
    for (let line of lines) {
      line = "> " + line;
      newLines.push(line);
    }
    let newText = newLines.join("\n");
    newText = "### License\n\n> \n" + newText;
    return newText;
  },
  code: function (text) {
    let newText = text;
    newText = "```\n" + newText;
    newText = newText + "\n```";
    newText = "### License\n\n" + newText;
    return newText;
  },
};

function LicensePreview(props) {
  return <pre>{props.children}</pre>;
}

function DownloadLink(props) {
  return (
    <Button
      variant="contained"
      onClick={() => {
        const url = window.URL.createObjectURL(new Blob([props.licenseText]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "LICENSE";
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
    >
      {i18next.t("click_to_download_license_file")}
    </Button>
  );
}

function App() {
  const [sources, setSources] = useState([]);
  const [selected, setSelected] = useState();
  const [year, setYear] = useState(CacheManager.readYear());
  const [user, setUser] = useState(CacheManager.readAuthor());
  const [licenceShortStr, setLicenseShortStr] = useState("");
  const [licenceLargeStr, setLicenseLargeStr] = useState("");

  useEffect(() => {
    fetchSource().then(
      (sources) => {
        setSources(sources);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  useEffect(() => {
    if (sources.length === 0) {
      return;
    }
    setSelected(sources[0]);
  }, [sources]);
  useEffect(() => {
    if (!selected) {
      return;
    }
    const { id, header, full } = selected;
    setLicenseShortStr(formatLicenseShortOut(header, { id, year, user }));
    setLicenseLargeStr(formatLicenseLargeOut(full, { id, year, user }));
  }, [selected, year, user]);
  const handleChange = (event) => {
    const id = event.target.value;
    if (!id) {
      return;
    }
    const source = sources.find((e) => {
      return e.id === id;
    });
    if (source) {
      setSelected(source);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Typography variant="h3" gutterBottom>
          {i18next.t("title")}
        </Typography>
        <div className="controls-wrapper">
          <TextField
            id="year-input"
            label={i18next.t("label_year")}
            variant="filled"
            value={year}
            onChange={(event) => {
              let year = event.target.value;
              setYear(year);
              CacheManager.saveYear(year);
            }}
          />
          <TextField
            id="author-input"
            label={i18next.t("label_author")}
            variant="filled"
            value={user}
            onChange={(event) => {
              let author = event.target.value;
              setUser(author);
              CacheManager.saveAuthor(author);
            }}
          />
          <FormControl variant="filled">
            <InputLabel id="license-select-label">
              {i18next.t("label_license")}
            </InputLabel>
            <Select
              labelId="license-select-label"
              id="license-select"
              value={selected ? selected.id : ""}
              label={i18next.t("label_license")}
              onChange={handleChange}
            >
              {sources.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.short}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="license-view">
          <div className="panel-short">
            <CopyToClipboard text={generator["code"](licenceShortStr)}>
              <Button variant="contained">
                {i18next.t("copy_to_copyboard")}
              </Button>
            </CopyToClipboard>
            <LicensePreview className="preview">{licenceShortStr}</LicensePreview>
          </div>
          <div className="panel-long">
            <DownloadLink licenseText={licenceLargeStr} />
            <LicensePreview className="preview">{licenceLargeStr}</LicensePreview>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
