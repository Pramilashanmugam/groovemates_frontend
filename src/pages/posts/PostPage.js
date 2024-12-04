import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

/**
 * PostPage component that displays a single post along with its comments.
 * 
 * This component fetches the post details and comments, and displays them.
 * It also allows users to create new comments if they are logged in.
 */
function PostPage() {
  const { id } = useParams(); // Fetch the post ID from the URL
  const [post, setPost] = useState({ results: [] }); // State to store the post data
  const [comments, setComments] = useState({ results: [] }); // State to store the comments for the post

  const currentUser = useCurrentUser(); // Get current user details from the context
  const profile_image = currentUser?.profile_image; // Profile image of the logged-in user

  // Fetch post and comments when the component mounts or when the post ID changes
  useEffect(() => {
    const handleMount = async () => {
      try {
        // Fetch both the post and the comments in parallel using Promise.all
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}`), // Fetch the post details
          axiosReq.get(`/comments/?post=${id}`), // Fetch the comments for the post
        ]);
        setPost({ results: [post] }); // Set the post data
        setComments(comments); // Set the comments data
      } catch (err) {
        console.log(err); // Log any errors encountered during the fetch
      }
    };

    handleMount();
  }, [id]); // Re-run the effect whenever the post ID changes

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* Render popular profiles for mobile devices */}
        <PopularProfiles mobile />
        
        {/* Display the post details */}
        <Post {...post.results[0]} setPosts={setPost} postPage />

        <Container className={appStyles.Content}>
          {/* Show comment creation form if user is logged in, otherwise display message */}
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}

          {/* Render comments with infinite scroll if there are comments available */}
          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setPost={setPost}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length} // Number of comments already loaded
              loader={<Asset spinner />} // Show loading spinner while fetching more comments
              hasMore={!!comments.next} // Check if there are more comments to load
              next={() => fetchMoreData(comments, setComments)} // Fetch more comments when scrolled to the bottom
            />
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span> // Prompt the user to comment if no comments
          ) : (
            <span>No comments... yet</span> // Message for non-logged in users if no comments are present
          )}
        </Container>
      </Col>

      {/* Render popular profiles for larger screens */}
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostPage;
