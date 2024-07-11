import React, { useState, useEffect } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";

import { CopyToClipboard } from "react-copy-to-clipboard";

function fetchSource() {
  return new Promise((resolve, reject) => {
    fetch(process.env.PUBLIC_URL + "/resources/licenses.json")
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
              // console.log(url1);
              let resp = await fetch(url1);
              text1 = await resp.text();
            } catch (e) {
              console.error(e);
            }
            let text2;
            try {
              // console.log(url2);
              let resp = await fetch(url2);
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
  } else if (info.id === "mit") {
    yearPattern = "[year]";
    userPattern = "[fullname]";
  } else if (info.id === "agpl-3.0") {
    yearPattern = "<year>";
    userPattern = "<name of author>";
  }

  const lines = text.split("\n");
  const newLines = [];
  for (let line of lines) {
    if (trimStart) {
      line = line.trimStart();
      line = " " + line;
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

const generator = {
  quote: function (text) {
    const lines = text.split("\n");
    const newLines = [];
    for (let line of lines) {
      line = "> " + line;
      newLines.push(line);
    }
    let newText = newLines.join("\n");
    newText = "### License \n> \n" + newText;
    return newText;
  },
  code: function (text) {
    let newText = text;
    newText = "```\n" + newText;
    newText = newText + "\n```";
    newText = "### License \n" + newText;
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
      点击下载协议文件
    </Button>
  );
}

function App() {
  const [sources, setSources] = useState([]);
  const [selected, setSelected] = useState();
  const [year, setYear] = useState(new Date().getFullYear());
  const [user, setUser] = useState("mylhyz");
  const [licenceShortStr, setLicenseShortStr] = useState("");
  const [licenceLargeStr, setLicenseLargeStr] = useState("");

  useEffect(() => {
    fetchSource().then(
      (sources) => {
        // console.log(sources);
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
    //默认选中第一个
    setSelected(sources[0]);
  }, [sources]);
  useEffect(() => {
    if (!selected) {
      return;
    }
    const { id, header, full } = selected;
    setLicenseShortStr(formatLicenseShortOut(header, { id, year, user }));
    setLicenseLargeStr(full);
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
    <div className="App">
      <Typography variant="h3" gutterBottom>
        开源协议生成器
      </Typography>
      <Grid sx={{ flexGrow: 0 }} container spacing={2} justifyContent="center">
        <Grid item xs={1}>
          <TextField
            id="standard-basic"
            label="年份"
            variant="standard"
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            id="standard-basic"
            label="版权人"
            variant="standard"
            value={user}
            onChange={(event) => {
              setUser(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">协议</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={selected ? selected.id : ""}
              label="协议"
              onChange={handleChange}
            >
              {sources.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.short}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <div className="license-view">
        <div className="panel-short">
          <CopyToClipboard text={generator["code"](licenceShortStr)}>
            <Button variant="contained">拷贝到剪贴板</Button>
          </CopyToClipboard>
          <LicensePreview className="preview">{licenceShortStr}</LicensePreview>
        </div>
        <div className="panel-long">
          <DownloadLink licenseText={licenceLargeStr} />
          <LicensePreview className="preview">{licenceLargeStr}</LicensePreview>
        </div>
      </div>
    </div>
  );
}

export default App;
