import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import axios from "axios";
import moment from 'moment';
import { useEffect, useState } from "react";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


function Cards() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [signedPosts, setSignedPosts] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      axios.get("http://campaignwithus.ml:8080/posts/visitors").then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setSignedPosts(response.data.signedPosts.map((sign) => {
          return sign.PostId;
        }))
      });
    } else {
      axios.get("http://campaignwithus.ml:8080/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setSignedPosts(response.data.signedPosts.map((sign) => {
          return sign.PostId;
        }))
      });
    }

  }, []);

  const signAPost = (postId) => {
    axios.post("http://campaignwithus.ml:8080/signatures", {
      PostId: postId
    },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if (post.id === postId) {
          if (response.data.signed) {
            return { ...post, Signatures: [...post.Signatures, 0] };
          } else {
            const signatureArray = post.Signatures;
            signatureArray.pop();
            return { ...post, Signatures: signatureArray };
          }
        } else {
          return post;
        }
      })
      );

      if (signedPosts.includes(postId)) {
        setSignedPosts(
          signedPosts.filter((id) => {
            return id != postId;
          })
        );
      } else {
        setSignedPosts([...signedPosts, postId]);
      }
    });
  };

  const vistorClick = () => {
    window.location.href = '/login';
  }
  return (
    <div className='cards'>
      <h1>Check out these fantastic Campaigns!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper' >

          <ul className='homeCards_campaign'>
            {listOfPosts.slice(0, 2).map((value, key) => {
              return (
                <div className='homeCard' key={key}>
                  <CardItem key={key}
                    src={value.cover ? value.cover : 'images/img-9.jpg'}
                    title={value.title}
                    text={value.postText.length > 180 ?
                      ReactHtmlParser(value.postText.substring(0, 180)
                        .replace(/<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>|<br>|<\/br>|<em>|<\/em>/g, '') + "...") :
                      ReactHtmlParser(value.postText.replace(/<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>|<br>|<\/br>|<em>|<\/em>/g, ''))}
                    topic={value.topic}
                    username={value.username}
                    dateTime={moment(value.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                    path={`/post/${value.id}`}
                    prof={`/profile/${value.UserId}`}
                  />
                  <div className='signContainer'>

                    {localStorage.getItem("accessToken") ? (
                      <div>
                        {!signedPosts.includes(value.id) ? (<button className='btnSign' onClick={() => {
                          signAPost(value.id);
                        }}>Sign</button>) :
                          (<button className='btnSigned' onClick={() => {
                            signAPost(value.id);
                          }}>Signed</button>)}
                        <label className='signNo'>{value.Signatures.length}</label>
                      </div>
                    ) :
                      (
                        <div>
                          <button className='btnSign' onClick={vistorClick}>Sign</button>
                          <label className='signNo'>{value.Signatures.length}</label>
                        </div>
                      )}
                  </div>
                </div>
              )
            })}
          </ul>
          <ul className='cards__items'>
            {listOfPosts.slice(2, 5).map((value, key) => {
              return (

                <div className='homeCard2' key={key}>
                  <CardItem key={key}
                    src='images/img-9.jpg'
                    title={value.title}
                    text={value.postText.length > 110 ? ReactHtmlParser(value.postText.substring(0, 110)
                      .replace(/<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>|<br>|<\/br>|<em>|<\/em>/g, '') + "...") :
                      ReactHtmlParser(value.postText.replace(/<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>|<br>|<\/br>|<em>|<\/em>/g, ''))}
                    topic={value.topic}
                    username={value.username}
                    dateTime={moment(value.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                    path={`/post/${value.id}`}
                  ></CardItem>
                  <div className='signContainer'>
                    {localStorage.getItem("accessToken") ? (
                      <div>
                        {!signedPosts.includes(value.id) ? (<button className='btnSign' onClick={() => {
                          signAPost(value.id);
                        }}>Sign</button>) :
                          (<button className='btnSigned' onClick={() => {
                            signAPost(value.id);
                          }}>Signed</button>)}
                        <label className='signNo'>{value.Signatures.length}</label>
                      </div>
                    ) :
                      (
                        <div>
                          <button className='btnSign' onClick={vistorClick}>Sign</button>
                          <label className='signNo'>{value.Signatures.length}</label>
                        </div>
                      )}
                  </div>

                </div>

              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
