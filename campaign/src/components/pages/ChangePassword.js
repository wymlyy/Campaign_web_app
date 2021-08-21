import React, { useState } from "react";
import '../../App.css';
import axios from "axios";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const changePassword = () => {
        axios
            .put(
                "http://3.16.1.56:8080/auth/changepassword",
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                }
            });
    };

    return (
        <>
            <div className='Profile'>
                <h1>Change Your Password</h1>
            </div>
            <div className='passwordInput'>
                <div className='passOld'>
                    <input className='inputOld'
                        type="text"
                        placeholder="Old Password..."
                        onChange={(event) => {
                            setOldPassword(event.target.value);
                        }}
                    />
                </div>
                <div className='passNew'>
                    <input className='inputNew'
                        type="text"
                        placeholder="New Password..."
                        onChange={(event) => {
                            setNewPassword(event.target.value);
                        }}
                    />
                </div>
                <div className='saveBtn'>
                    <button className='btnSave' onClick={changePassword}> Save Changes</button>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;