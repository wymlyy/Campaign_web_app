import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./textEditor.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import validate from "../accountBox/validateInfoPost";
import useForm3 from "../accountBox/useForm3";



const TextEditor = (submitForm) => {
  const { handleChange, handleSubmit, onEditorStateChange, handleTime, handleFile, cover, active, startDate, editorState, postText, values, errors } = useForm3(
    submitForm,
    validate
  );


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
      {console.log(active)}
      <form id='postForm' onSubmit={handleSubmit}>
        <h1 className='postPageTitle'>Create Your Own Campaign !</h1>
        <div className='selectInfo'>
          <div className='selectTopic'>
            <label>Select One Topic:</label>

            <select id='topicSelection' className='topic' name='topic' value={values.topic} onChange={handleChange}>
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
              dateFormat="yyyy-MM-dd HH:mm:ss"
              timeFormat="hh:mm:ss"
              use24Hours={true}
              selected={startDate}
              name='startDate'
              value={startDate}
              onChange={handleTime}
              showTimeSelect
            />
            {errors.startDate && <p className='errors'>{errors.startDate}</p>}
          </div>

        </div>
        <div className="otherInfo">
          <div className="campaignLocation">
            <label>Location:</label>

            <input className='locationInput' type="text" name='location' value={values.location} onChange={handleChange} />
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

          <input type="text" className="titleInput" name='title' value={values.title} onChange={handleChange} />
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
            Post
          </button>
        </div>
      </form>
    </div>
  );

}
export default TextEditor;