import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import './App.css';
import 'trix';
import 'trix/dist/trix.css';
import { TrixEditor } from "react-trix";
import docsModel from './models/docsModel';

let sendToSocket = false;

function changeSendToSocket(value) {
    sendToSocket = value;
}

function App() {
    const [currentDoc, setCurrentDoc] = useState(null);
    const [socket, setSocket] = useState(null);
    const [docs, setDocs] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, [currentDoc]);

    useEffect(() => {
        setSocket(io("https://jsramverk-editor-ersm21.azurewebsites.net"));

        if (socket) {
            return () => {
                socket.disconnect();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (socket && sendToSocket && currentDoc) {
            const data = {
                _id: currentDoc._id,
                title: currentDoc.title,
                content: content
            };
            socket.emit("update", data);
        }
        changeSendToSocket(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    useEffect(() => {
        if (socket) {
            socket.on("update", (data) => {
                changeSendToSocket(false);
                setContent(data);
                setEditorContent(data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    function setEditorContent(selectedDoc) {
        const element = document.querySelector("trix-editor");
        element.value = "";
        element.editor.insertHTML(selectedDoc.content);
    }

    function fetchDoc() {
        const selectedDocId = document.getElementById("selectDoc").value;
        const selectedDoc = docs[selectedDocId];
        if (currentDoc) {
            socket.emit("leave", currentDoc["_id"]);
        }

        setCurrentDoc(selectedDoc);

        socket.emit("create", selectedDoc["_id"]);

        document.getElementById("saveBtn").style.display = "none";
        document.getElementById("updateBtn").style.display = "block";
        document.getElementById("nameLabel").style.display = "none";

        if (selectedDoc) {
            setEditorContent(selectedDoc);
        }
    };

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
        <div className="App">
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
