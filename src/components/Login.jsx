import { useState } from 'react';

import authModel from '../models/authModel';
import "../App.css";

export default function Login({setToken, setCurrentUserId}) {
    const [user, setUser] = useState({});

    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;

        setUser({...user, ...newObject});
    }

    async function register() {
        await authModel.register(user);
        login();
    }

    async function login() {
        const loginResult = await authModel.login(user);

        if (loginResult.data.token) {
            setCurrentUserId(loginResult.data._id);
            setToken(loginResult.data.token);
        }
    }

    return (
        <>
            <h2>Logga in eller registrera dig</h2>
            <p>Email</p>
            <input type="email" name="email" onChange={changeHandler} />
            <p>Lösenord</p>
            <input type="password" name="password" onChange={changeHandler} />

            <button className="submitbuttons" onClick={register}>Registrera</button>
            <button className="submitbuttons" onClick={login}>Logga in</button>
        </>
    );
}
