import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import './App.css';
import 'trix';
import 'trix/dist/trix.css';
import { TrixEditor } from "react-trix";

import docsModel from "./models/docsModel";
import authModel from "./models/authModel";

import Login from "./components/Login";

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
    const [token, setToken] = useState("");
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");

    async function getDocs() {
        if (token) {
            const allDocs = await docsModel.getDocs(token, currentUserId);
            setDocs(allDocs);
        }
    }

    async function getAllUsers() {
        if (token) {
            const allUsers = await authModel.getAllUsers();
            setUsers(allUsers);
        }
    }

    useEffect(() => {
        (async () => {
            await getDocs();
            await getAllUsers();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

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
                content: content,
                owner: currentDoc.owner,
                allowed_users: currentDoc.allowed_users
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
        document.getElementById("selectUser").style.display = "block";

        if (selectedDoc) {
            setEditorContent(selectedDoc);
        }
    };

    async function fetchUser() {
        const selectedUserEmail = document.getElementById("selectUser").value;
        const selectedUser = users[selectedUserEmail];

        currentDoc.allowed_users.push(selectedUser._id);
        await docsModel.updateDoc(currentDoc);
    };

    async function saveDoc() {
        const newDoc = {
            title: title,
            content: content,
            owner: currentUserId,
            allowed_users: [currentUserId]
        }

        await docsModel.saveDoc(newDoc);
        await getDocs();
    }

    async function updateDoc() {
        currentDoc.content = content;
        await docsModel.updateDoc(currentDoc);
    }

    return (
        <div className="App">
            {token ?
            <>
            {docs.length > 0 &&
                <select
                    id="selectDoc"
                    onChange={fetchDoc}
                >
                    <option value="-99" key="0">Välj ett dokument</option>
                    {docs.map((doc, index) => <option value={index} key={index}>{doc.title}</option>)}
                </select>
            }

            <select
                style={{display: "none"}}
                id="selectUser"
                onChange={fetchUser}
            >
                <option value="-99" key="0">Välj en användare som får tillstånd att redigera ditt dokument</option>
                {users.map((user, index) => <option value={index} key={index}>{user.email}</option>)}
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
            </>
            :
            <Login setToken={setToken} setCurrentUserId={setCurrentUserId} />
            }
        </div>
    )
}

export default App;
