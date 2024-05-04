import React, { useState, useEffect } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Markdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";

function App() {
  const [year, setYear] = useState("2024");
  const [user, setUser] = useState("mylhyz");
  const [licenceShortStr, setLicenseShortStr] = useState("");
  const [licenceShortMarkdownStr, setLicenseShortMarkdownStr] = useState("");
  useEffect(() => {
    setLicenseShortStr("");
  }, []);
  useEffect(() => {
    setLicenseShortMarkdownStr("# Hi, *Pluto*!");
  }, [licenceShortStr]);
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
      <CopyToClipboard text="Hello!">
        <Button variant="contained">拷贝到剪贴板</Button>
      </CopyToClipboard>
      <Markdown>{licenceShortMarkdownStr}</Markdown>
    </div>
  );
}

export default App;
