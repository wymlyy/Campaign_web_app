import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import moment from "moment";
import axios from 'axios';
import Footer from '../Footer';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import '../../App.css';

function MyProfile() {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get(`https://campaignwithus.ml:8080/auth/basicinfo/${authState.id}`).then((response) => {
      setUsername(response.data.username);
      setAvatar(response.data.avatar);
    });


    axios.get(`https://campaignwithus.ml:8080/posts/byUserId/${authState.id}`).then((response) => {
      setListOfPosts(response.data);
    });

  }, []);

  const changeAvatar = () => {
    axios.put(
      "https://campaignwithus.ml:8080/auth/avatar",
      {
        newAvatar: avatar,
        username: username,
      },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    ).then(() => {
      setIsOpen(!isOpen);
      window.location.href = '/my-profile';
    })


  }

  const handleFile = async (e) => {
    const uploadFile = e.target.files[0];
    const base64 = await convertBase64(uploadFile);
    setAvatar(base64);
    console.log(avatar);
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
        fileReader.onerror = (error) => {
          reject(error);
        }
      }
    })
  }

  const deletePost = (id) => {
    axios
      .delete(`https://campaignwithus.ml:8080/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        window.location.href = '/my-profile';
      });
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div className='Profile'>
        <h1> Username: {username} </h1>
        <img className='userImg' src={avatar ? avatar : 'images/user.png'} alt='user'
          onClick={togglePopup} />
        {isOpen && (
          <div className='popupAvatar'>
            <div className='avatarContainer'>
              <span className="close-icon" onClick={togglePopup}>x</span>
              <div className='avatarImg'>
                <img className='userImg2' src={avatar ? avatar : 'images/user.png'} alt='user' />
              </div>
              <div className='uploadAvatar'>
                <label className="uploadPic">
                  <input type="file" name='avatar' accept="image/*" onChange={(e) => { handleFile(e) }} />
                  <div className='uploadIconText'>
                    <CloudUploadIcon className='uploadIcon'></CloudUploadIcon> <p className='uploadText'>Upload Image</p>
                  </div>
                  <button className='changePassword' onClick={changeAvatar}> Save </button>
                </label>

              </div>
            </div>
          </div>
        )}

        <div className='passContainer'>
          <button className='changePassword'
            onClick={() => {
              history.push("/changepassword");
            }}
          >
            Change My Password
          </button>
        </div>
      </div>
      <div className="listOfPosts">
        <h2 className='postHis'>Post History</h2>
        {listOfPosts.reverse().map((value, key) => {
          return (
            <div key={key} className="postList">
              <div className='listHeader'>
                <div className="profileTitle"> Title: {value.title} </div>
                <div className='profilePostDate'>
                  {moment(value.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                </div>
              </div>
              <div className="listFooter">
                <div className='footerBtn'>
                  <button className='viewBtn' onClick={() => {
                    history.push(`/post/${value.id}`);
                  }}> View</button>
                  <button className='deleteBtn' onClick={() => deletePost(value.id)}>Delete</button>
                </div>
                <div className="footerSign">
                  <label>Signatures: {value.Signatures.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </>
  )
}

export default MyProfile
