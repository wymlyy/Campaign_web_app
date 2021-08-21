import React, { useState, useEffect, useContext } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext";
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';
import axios from 'axios';
import './Navbar.css';


function Navbar() {
  const [authState, setAuthState] = useState({
    username: "",
    email: "",
    avatar: "",
    id: 0,
    status: false,
  });
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const [avatar, setAvatar] = useState("");
  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();

    axios.get("//campaignwithus.ml:8080/auth/verification", {

      headers: {
        accessToken: localStorage.getItem("accessToken"),
      }
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar,
          id: response.data.id,
          status: true,
        });
        axios.get(`//campaignwithus.ml:8080/auth/basicinfo/${response.data.id}`).then((response) => {
          if (response.data != null) {
            setAvatar(response.data.avatar);
          }

        });
      }
    });
  }, []);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    window.location.href = '/';
  };

  window.addEventListener('resize', showButton);

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <nav className='navbar'>
          <div className='navbar-container'>
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              <img className='img-logo' src={Logo} alt="" />
            </Link>
            <div className='menu-icon' onClick={handleClick} >
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <NavLink exact to='/' className='nav-links' activeClassName='nav-links active' onClick={closeMobileMenu}>
                  Home
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink exact
                  to='/campaigns'
                  className='nav-links'
                  activeClassName='nav-links active'
                  onClick={closeMobileMenu}
                >
                  Campaigns
                </NavLink>
              </li>

              {authState.status ?
                (<li className='nav-item'>
                  <NavLink exact
                    to='/write'
                    className='nav-links'
                    activeClassName='nav-links active'
                    onClick={closeMobileMenu}
                  >Post</NavLink>
                </li>) : (<li className='nav-item'>
                  <Link
                    to='/login'
                    className='nav-links'
                    onClick={closeMobileMenu}
                  >Post</Link>
                </li>)}

              {authState.status &&
                <li className='nav-item'>
                  <NavLink exact
                    to='/my-profile'
                    className='nav-links'
                    activeClassName='nav-links active'
                    onClick={closeMobileMenu}
                  >
                    My Profile
                  </NavLink>
                </li>
              }
              {!authState.status ?
                (<li>
                  <Link
                    to='/login'
                    className='nav-links-mobile'
                    onClick={closeMobileMenu}
                  >
                    Login/Signup
                  </Link>
                </li>) : (<li>
                  <Link
                    to='/'
                    className='nav-links-mobile'
                    onClick={logout}
                  >
                    Logout
                  </Link>
                </li>)}
            </ul>
            {!authState.status ? (<div>{button && (<Button buttonStyle='btn--signup'>Login/Signup</Button>)}</div>) : (<div><span className='userNav'><img className='avatarPic' src={avatar ? avatar : 'images/user.png'} /></span>{button && (<Button onClick={logout} buttonStyle='btn--signup'>Logout</Button>)}</div>)}
          </div>
        </nav>

      </AuthContext.Provider>
    </>
  );
}

export default Navbar;
