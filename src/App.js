import React, { useState } from 'react';
import './App.css';

import "trix";
import "trix/dist/trix.css";

import { TrixEditor } from "react-trix";

function App() {
  const [value, setValue] = useState("Skriv något");
  const printContent = () => {
    console.log(value);
  }
  return (
    <div className="App">
      <button className="saveButton" onClick={printContent}>Spara</button>
        <TrixEditor
          value = {value}
          onChange = {setValue}
        />
    </div>
  );
}

export default App;
