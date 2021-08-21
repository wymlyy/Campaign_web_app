import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from "axios";

function FormLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);

    const login = (e) => {
        e.preventDefault();
        const data = { username: username, password: password };
        axios.post("http://campaignwithus.ml:8080/auth/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                });

                window.location.href = '/';
            };

        });
    };
    return (

        <div className="form-content-right">
            <form className='form'>
                <h1>
                    Welcome Back !
                </h1>
                <label className='form-label'>Username:</label>
                <div className='form-inputs'>
                    <input className='form-input'
                        type="text"
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                </div>
                <label className='form-label'>Password:</label>
                <div className='form-inputs'>
                    <input className='form-input'
                        type="password"
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                </div>
                <button className='form-input-btn' onClick={login}> Login </button>
                <span className='form-input-login'>
                    Don't have an account? Signup <Link to='/sign-up'>here</Link>
                </span>
            </form>
        </div>

    );
}

export default FormLogin;
