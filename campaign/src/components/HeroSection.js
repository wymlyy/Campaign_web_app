import React, { useState, useEffect } from 'react';
import '../App.css';
import { Button2 } from './Button2';
import { Link } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext";
import { useHistory } from "react-router";
import axios from 'axios';
import './HeroSection.css';


function HeroSection() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  let history = useHistory();

  useEffect(() => {
    axios.get("https://campaignwithus.ml:8080/auth/verification", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      }
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });

      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });

      }
    });

  }, []);

  return (
    <div className='hero-container'>
      <div className='homepage-img'>
        <img className='homepage-insertImg' src='/images/group.png' alt="" />
      </div>
      <div className='homepage-txt-btn'>
        <h1>Your campaign journey starts here.</h1>
        <p>Campaign With US provides a free platform to create and
          share your campaign through online medium.
          Get started by logging in or clicking below.</p>
        <div className='hero-btns'>
          <AuthContext.Provider value={{ authState, setAuthState }}>
            <Button2
              className='btns'
              buttonStyle='btn--signup'
              buttonSize='btn--large'
            >{authState.status ? (<Link to='/write' style={{ textDecoration: 'none' }}><img className='hero-btns-img' src='images/create.png' alt=' ' height='27' />&nbsp;&nbsp;<span className='hero-btn-text'>Create a Campaign</span></Link>) :
              ((<Link to='/login' onClick={() => {
                history.push('/login')
              }} style={{ textDecoration: 'none' }}><img className='hero-btns-img' src='images/create.png' alt=' ' height='27' />&nbsp;&nbsp;<span className='hero-btn-text'>Create a Campaign</span></Link>))}
            </Button2>
          </AuthContext.Provider>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;
