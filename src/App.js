import React, { useState, useEffect } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Markdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";

function App() {
  const [year, setYear] = useState("2024");
  const [user, setUser] = useState("mylhyz");
  const [licenceShortStr, setLicenseShortStr] = useState("");
  const [age, setAge] = useState("");
  const [licenceShortMarkdownStr, setLicenseShortMarkdownStr] = useState("");
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/resources/licenses.json")
      .then((res) => res.json())
      .then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
      );
    setLicenseShortStr("");
  }, []);
  useEffect(() => {
    setLicenseShortMarkdownStr("# Hi, *Pluto*!");
  }, [licenceShortStr]);
  const handleChange = (event) => {
    setAge(event.target.value);
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
        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <CopyToClipboard text="Hello!">
        <Button variant="contained">拷贝到剪贴板</Button>
      </CopyToClipboard>
      <Markdown>{licenceShortMarkdownStr}</Markdown>
    </div>
  );
}

export default App;
