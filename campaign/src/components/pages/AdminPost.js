import React, { useEffect, useState, useContext } from 'react';
import '../../App.css';
import './post.css';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from '../../Context/AuthContext';
import Footer from '../Footer';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import moment from 'moment';

export default function AdminPost() {
    document.body.id = 'adminPostId';
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    const dateStart = moment(postObject.startDate).format("DD-MM-YYYY HH:mm");
    const [active, setActive] = useState('');


    useEffect(() => {
        axios.get(`http://campaignwithus.ml:8080/posts/byId/${id}`).then((response) => {
            setActive(response.data.isActive);
            setPostObject(response.data);
            console.log(response.data);
        });

        axios.get(`http://campaignwithus.ml:8080/comments/${id}`).then((response) => {
            setComments(response.data);
        });

    }, []);
    const addComment = () => {

        axios.post("http://campaignwithus.ml:8080/comments/", { commentText: newComment, PostId: id },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            }).then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    const commentAdd = {
                        commentText: newComment,
                        username: response.data.username
                    };
                    setComments([...comments, commentAdd]);
                    setNewComment("");
                    window.location.href = `/post/${id}`;
                }

            })
    };

    const deleteComment = (commentId) => {

        axios.delete(`http://campaignwithus.ml:8080/comments/${commentId}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
        })
            .then(() => {
                setComments(
                    comments.filter((val) => {
                        return val.id != commentId;
                    })
                );
            });
    };

    const deletePost = (id) => {
        axios
            .delete(`http://campaignwithus.ml:8080/posts/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                window.location.href = '/';
            });

    };

    const vistorClick = () => {
        window.location.href = '/login';
    };

    const approvePost = () => {
        axios.put(
            "http://campaignwithus.ml:8080/posts/isActive",
            {
                newActive: "true",
                id: id,
            }
        )
        alert("You have approved the post successfully!");
        window.location.href = `/admin-post/${id}`;
    };



    // const editPost = (option) => {
    //     if (option === "title") {
    //         let newTitle = prompt("Enter New Title:");
    //         axios.put(
    //             "http://campaignwithus.ml:8080/posts/title",
    //             {
    //                 newTitle: newTitle,
    //                 id: id,
    //             },
    //             {
    //                 headers: { accessToken: localStorage.getItem("accessToken") },
    //             }
    //         )

    //         setPostObject({ ...postObject, title: newTitle });
    //     }
    // }
    return (
        <>
            <div className='postPage'>
                <div className='campaigns'>
                    <div className='overlay'>
                        <h1 className='posttitle'>{postObject.title}</h1>
                        <div className='infoContainer'>
                            <div className='lineOne'>
                                <div className='postTopic'>Topic: {postObject.topic}
                                </div>
                                <div className='postLocation'>Location: {postObject.location}</div>
                            </div >
                            <div className='lineTwo'>
                                <div className='postAuthor'>Author: {postObject.username}</div>
                                <div className='postDate'>Start Time: {dateStart}</div>

                            </div>
                        </div >

                    </div >
                </div >
                <div className='postComment'>
                    <div className='modifyPost'>
                        <div className="deletePost">
                            {postObject.isActive !== "true" && (
                                <button className='deletePostBtn'
                                    onClick={approvePost}
                                >
                                    Approve
                                </button>
                            )}


                        </div>
                        <div className="deletePost">

                            <button className='deletePostBtn'
                                onClick={() => {
                                    deletePost(postObject.id);
                                }}
                            >
                                Delete Post
                            </button>

                        </div>
                    </div>

                    <div className='postText'>
                        <div className='textContent'>{ReactHtmlParser(postObject.postText)}</div>

                    </div>
                    <div className="comments">
                        <h1 className='commentTitle'> Make your comment here</h1>
                        <div className='addComment'>
                            <textarea type='text' placeholder="Add your comment here..." autoComplete="off" value={newComment} onChange={(event) => { setNewComment(event.target.value) }} />
                        </div>
                        <div className='commentButton'>
                            {localStorage.getItem("accessToken") ? <button className='commentBtn' type='submit' onClick={addComment}>
                                Comment
                            </button> : <button className='commentBtn' type='submit' onClick={vistorClick}>
                                Comment
                            </button>}

                        </div>

                        <div className='listOfComments'>
                            {comments.map((comment, key) => {
                                return (
                                    <div key={key} className='comment'>
                                        <label className='commentUser'>User: {comment.username}<span className='dateposted'>{moment(comment.createdAt).format("DD-MM-YYYY HH:mm:ss")}</span></label>
                                        <div className='textOfComment'>{comment.commentText}</div>
                                        <div className='commentBtnContainer'>
                                            <div className='tooltip'>{authState.username === comment.username && (<><DeleteIcon onClick={() => {
                                                deleteComment(comment.id);
                                            }} className='deleteIcon' /><span className='tooltipText'>Delete</span></>)}</div>
                                        </div>


                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );

}
