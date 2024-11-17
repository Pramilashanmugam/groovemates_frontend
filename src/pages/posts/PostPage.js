import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import commentStyles from "../../styles/CommentCreateEditForm.module.css"; // Import the CSS module
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Comment from "../comments/Comment";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  // Function to handle adding a reply to a specific parent comment
  const addReplyToParent = (newReply) => {
    setComments((prevComments) => ({
      ...prevComments,
      results: prevComments.results.map((comment) =>
        comment.id === newReply.parent
          ? { ...comment, replies: [newReply, ...comment.replies] }
          : comment
      ),
    }));
  };

  // Recursive function to render comments and their replies
  const renderComments = (comments) =>
    comments.map((comment) => (
      <div
        key={comment.id}
        className={commentStyles.Reply} // Apply Reply styles for indentation
        style={{ marginLeft: comment.parent ? "20px" : "0" }}
      >
        <Comment {...comment} />
        {currentUser && (
          <CommentCreateForm
            profile_id={currentUser.profile_id}
            profileImage={profile_image}
            post={id}
            parent={comment.id} // Pass parent ID for replies
            addReplyToParent={addReplyToParent} // Handle reply addition
            className={commentStyles.ReplyForm} // Apply ReplyForm styles
          />
        )}
        {comment.replies && renderComments(comment.replies)} {/* Render nested replies */}
      </div>
    ));

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        <Post {...post.results[0]} setPosts={setPost} postPage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
              className={commentStyles.Form} // Apply Form styles
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            renderComments(comments.results) // Use the recursive function
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;
