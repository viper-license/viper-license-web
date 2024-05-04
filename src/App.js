import "./App.css";
import TextField from "@mui/material/TextField";
import Markdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";

function App() {
  const markdownS = "# Hi, *Pluto*!";
  return (
    <div className="App">
      <TextField id="standard-basic" label="Standard" variant="standard" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
      <CopyToClipboard text="Hello!">
        <button>Copy to clipboard</button>
      </CopyToClipboard>
      <Markdown>{markdownS}</Markdown>
    </div>
  );
}

export default App;
