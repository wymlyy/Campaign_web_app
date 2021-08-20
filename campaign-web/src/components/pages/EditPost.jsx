import React, { useState, useEffect, useContext } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromRaw, convertFromHTML } from "draft-js";
import DatePicker from "react-datepicker";
import { AuthContext } from '../../Context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "./textEditor.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import validate from "../accountBox/validateInfoPost";
import useForm3 from "../accountBox/useForm3";



const EditPost = (submitForm) => {
  const { errors } = useForm3(
    submitForm,
    validate
  );
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const { authState } = useContext(AuthContext);
  const [topic, setTopic] = useState("");
  const [cover, setCover] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [startDate, setStartDate] = useState(new Date());
  const [postText, setPostText] = useState("");
  // const postText = stateToHTML(editorState.getCurrentContent());
  

  useEffect(() => {
    axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
      const blocksFromHtml = convertFromHTML(response.data.postText);
      const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap,)
      setTopic(response.data.topic);
      setCover(response.data.cover);
      setTitle(response.data.title);
      setLocation(response.data.location);
      setPostText(response.data.postText);
      setStartDate(response.data.startDate);
      setEditorState(EditorState.createWithContent(contentState));
      setPostObject(response.data);
      

    });

  }, []);

  const handleFile = async (e) => {
    const uploadFile = e.target.files[0];
    const base64 = await convertBase64(uploadFile);
    setCover(base64);
    console.log( cover);
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

  const handleTime = (date) => {
    setStartDate(date);
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

  };

  // const editPost = () => {
  //   if (Object.keys(errors).length === 0) {
  //     axios.put(`http://localhost:5000/posts/${id}`, {
  //       topic: topic,
  //       startDate: startDate,
  //       location: location,
  //       username: username,
  //       title: title,
  //       postText: postText
  //     }, {
  //       headers: { accessToken: localStorage.getItem("accessToken") },
  //     }).then((response) => {
  //       window.location.href = `/post/${id}`;
  //     });


  //   }
  // }

  const editPost = () => {


    axios.put(
      "http://localhost:5000/posts/title",
      {
        newTitle: title,
        id: id,
      },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )

    axios.put(
      "http://localhost:5000/posts/topic",
      {
        newTopic: topic,
        id: id,
      },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )

    axios.put(
      "http://localhost:5000/posts/location",
      {
        newLocation: location,
        id: id,
      },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )

    axios.put(
      "http://localhost:5000/posts/startDate",
      {
        newStartDate: startDate,
        id: id,
      },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )

    axios.put(
      "http://localhost:5000/posts/cover",
      {
        newCover: cover,
        id: id,
      },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )

    axios.put(
      "http://localhost:5000/posts/postText",
      {
        newPostText: postText,
        id: id,
      },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )


    setPostObject({ ...postObject, title: title, topic: topic, location: location, startDate: startDate, cover: cover, postText: postText });

  }

  const uploadCallback = (file) => {
    return new Promise(
      (resolve, reject) => {
        if (file) {
          let reader = new FileReader();
          reader.onload = (e) => {
            resolve({ data: { link: e.target.result } })
          };
          reader.readAsDataURL(file);
        }
      }
    );
  }

  return (
    <div>
      <form id='postForm' onClick={() => {
        if (authState.username === postObject.username) {
          editPost();
        }
      }}>
        <h1 className='postPageTitle'>Create Your Own Campaign !</h1>
        <div className='selectInfo'>
          <div className='selectTopic'>
            <label>Select One Topic:</label>

            <select id='topicSelection' className='topic' name='topic' value={topic} onChange={(e) => {
              setTopic(e.target.value)
            }}>
              <option value='none' hidden>Select a topic</option>
              <option value='sports'>Sports</option>
              <option value='Marketing'>Marketing</option>
              <option value='education'>Education</option>
              <option value='society'>Society</option>
              <option value='other'>Other</option>
            </select>
            {errors.topic && <p className='errors'>{errors.topic}</p>}
          </div>
          <div className='selectTime'>
            <label>Select Date and Time:</label>

            <DatePicker className='datepick'
              dateFormat="yyyy-MM-dd HH:mm"
              timeFormat="HH:mm"
              selected={authState.startDate}
              name='startDate'
              value={moment(startDate).format("DD-MM-YYYY HH:mm:ss")}
              onChange={handleTime}
              showTimeSelect
            />
            {errors.startDate && <p className='errors'>{errors.startDate}</p>}
          </div>

        </div>
        <div className="otherInfo">
          <div className="campaignLocation">
            <label>Location:</label>

            <input className='locationInput' type="text" name='location' value={location} onChange={(e) => {
              setLocation(e.target.value)
            }} />
            {errors.location && <p className='errors'>{errors.location}</p>}
          </div>
          <div className="authorName">
            <label>Cover:</label>
            <div className='author'>
              <input type="file" className="uploadFile" name='cover' accept="image/*" onChange={(e) => { handleFile(e) }} />
            </div>
          </div>
        </div>

        <div className="postTitle">
          <label>Title:</label>

          <input type="text" className="titleInput" name='title' value={title} onChange={(e) => {
            setTitle(e.target.value)
          }} />
          {errors.title && <p className='errors'>{errors.title}</p>}
        </div>

        <Editor
          name='postText'
          value={postText}
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              uploadEnabled: true,
              uploadCallback: uploadCallback,
              previewImage: true,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              alt: { present: false, mandatory: false },
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            },
          }}
        />
        {errors.postText && <p className='errors-content'>{errors.postText}</p>}
        <div className='postBtnContainer'>
          <button className='postButton' type='submit'>
            Update
          </button>
        </div>
      </form>
    </div>
  );

}
export default EditPost;