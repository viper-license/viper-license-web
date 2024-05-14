import React, { useState, useEffect } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CopyToClipboard } from "react-copy-to-clipboard";

function fetchSource() {
  return new Promise((resolve, reject) => {
    fetch(process.env.PUBLIC_URL + "/resources/licenses.json")
      .then((res) => res.json())
      .then(
        async (res) => {
          const sources = [];
          for (let item of res) {
            const { id, name, header, full } = item;
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
            sources.push({ id, name, header: text1, full: text2 });
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
  if (info.id === "apache") {
    yearPattern = "[yyyy]";
    userPattern = "[name of copyright owner]";
  } else if (info.id === "gpl3") {
    yearPattern = "<year>";
    userPattern = "<name of author>";
  } else if (info.id === "mit") {
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

function LicensePreview(props) {
  console.log(props.children);
  return <pre>{props.children}</pre>;
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
      <TextField
        id="standard-basic"
        label="年份"
        variant="standard"
        value={year}
        onChange={(event) => {
          setYear(event.target.value);
        }}
      />
      <TextField
        id="standard-basic"
        label="版权人"
        variant="standard"
        value={user}
        onChange={(event) => {
          setUser(event.target.value);
        }}
      />
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
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="LicenseView">
        <div className="panel-short">
          <CopyToClipboard text="Hello!">
            <Button variant="contained">拷贝到剪贴板</Button>
          </CopyToClipboard>
          <LicensePreview className="preview">{licenceShortStr}</LicensePreview>
        </div>
        <div className="panel-long">
          <CopyToClipboard text="Hello!">
            <Button variant="contained">拷贝到剪贴板</Button>
          </CopyToClipboard>
          <LicensePreview className="preview">{licenceLargeStr}</LicensePreview>
        </div>
      </div>
    </div>
  );
}

export default App;
