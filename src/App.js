import React, { useState, useEffect } from 'react';
import './App.css';
import 'trix';
import 'trix/dist/trix.css';
import { TrixEditor } from "react-trix";
import docsModel from './models/docsModel';

function App() {
    const [content, setContent] = useState("");
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [title, setTitle] = useState("");

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, [currentDoc]);

    function fetchDoc() {
        const selectedDocId = document.getElementById("selectDoc").value;
        const selectedDoc = docs[selectedDocId];

        setCurrentDoc(selectedDoc);

        document.getElementById("saveBtn").style.display = "none";
        document.getElementById("updateBtn").style.display = "block";
        document.getElementById("nameLabel").style.display = "none";

        if (selectedDoc) {
            setEditorContent(selectedDoc);
        }
    };

    function setEditorContent(selectedDoc) {
        const element = document.querySelector("trix-editor");
        element.value = "";
        element.editor.insertHTML(selectedDoc.content);
    }

    async function saveDoc() {
        const newDoc = {
            title: title,
            content: content
        }

        await docsModel.saveDoc(newDoc);
        window.location.reload()
    }

    async function updateDoc() {
        currentDoc.content = content;
        await docsModel.updateDoc(currentDoc);
    }

    return (
        <div className="app">
            <button onClick={() => window.location.reload()}>Skapa nytt</button>

            <select
                id="selectDoc"
                onChange={fetchDoc}
            >
                <option value="-99" key="0">Välj ett dokument</option>
                {docs.map((doc, index) => <option value={index} key={index}>{doc.title}</option>)}
            </select>

            <button style={{display: "none"}} id="updateBtn" onClick={() => updateDoc()}>Uppdatera</button>

            <form id="nameLabel">
                <label>Skriv in namn på filen:
                    <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    />
                </label>
            </form>

            <button id="saveBtn" onClick={() => saveDoc()}>Spara</button>

            <TrixEditor
                onChange={setContent}
            />
        </div>
    )
}

export default App;
