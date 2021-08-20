import React, { useEffect, useState } from "react";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ReactPaginate from "react-paginate";
import '../../App.css';
import '../Cards.css';
import CardItem from '../CardItem';
import Footer from '../Footer';
import moment from "moment";
import axios from "axios";


export default function Campaigns() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [signedPosts, setSignedPosts] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const postsPerPage = 9;
  const currentPage = postsPerPage * pageNum;


  useEffect(() => {

    if (!localStorage.getItem("accessToken")) {
      axios.get("http://localhost:5000/posts/visitors").then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setSignedPosts(response.data.signedPosts.map((sign) => {
          return sign.PostId;
        }))
      });
    } else {
      axios.get("http://localhost:5000/posts", {
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
    axios.post("http://localhost:5000/signatures", {
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

  const pageCount = Math.ceil(listOfPosts.length / postsPerPage);
  const onPageChange = ({ selected }) => {
    setPageNum(selected);
  }

  return (
    <>
      <div className='campaigns'>
        <div className='overlay'>
          <h1 className='campaignTitle'>Campaigns</h1>
        </div>
      </div>

      <div className='cards'>
        <div className='cards__container'>
          <div className='cards__wrapper' >

            <ul className='cards__items_campaign'>
              {listOfPosts.reverse().slice(currentPage, currentPage + postsPerPage).map((value, key) => {
                return (

                  <div className='campaignCard' key={key}>
                    <CardItem key={key}
                      src={value.cover ? value.cover : 'images/img-9.jpg'}
                      title={value.title}
                      text={value.postText.length > 80 ?
                        ReactHtmlParser(value.postText.substring(0, 80)
                          .replace(/<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>|<br>|<\/br>|<em>|<\/em>/g, '') + "...") :
                        ReactHtmlParser(value.postText
                          .replace(/<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>|<br>|<\/br>|<em>|<\/em>/g, ''))}
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
            <ReactPaginate
              previousLabel={"<<"}
              nextLabel={">>"}
              pageCount={pageCount}
              onPageChange={onPageChange}
              containerClassName={"paginateContainer"}
              pageLinkClassName={"paginateLink"}
              previousLinkClassName={"paginatePrev"}
              nextLinkClassName={"paginateNext"}
              disabledClassName={"paginateDisabled"}
              activeClassName={"paginateActive"}
              theme="circle"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
