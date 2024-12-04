import React, { useState } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import ReportForm from "../reports/ReportForm";

const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    share_count,
    like_id,
    event,
    description,
    location,
    date,
    time,
    image,
    updated_at,
    postPage,
    setPosts,
    is_shared_by_user,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [showReportModal, setShowReportModal] = useState(false);
  const [shareClicked, setShareClicked] = useState(false); // State to track if share button is clicked

  /**
   * Redirects to the post edit page
   */
  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  /**
   * Deletes the current post and navigates back
   */
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err); // Log any errors that occur during deletion
    }
  };

  /**
   * Handles liking a post by sending a POST request to the backend
   * and updating the like count in the state.
   */
  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err); // Log any errors during the like action
    }
  };

  /**
   * Handles unliking a post by sending a DELETE request to the backend
   * and updating the like count in the state.
   */
  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err); // Log any errors during the unlike action
    }
  };

  /**
   * Handles sharing the post by sending a POST request to the backend
   * and updating the share count in the state.
   */
  const handleShare = async () => {
    try {
      // Send a POST request to share the post
      await axiosRes.post("/shares/", { post: id });

      // Update the local state to increment the share count and mark post as shared by the user
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) =>
          post.id === id
            ? {
                ...post,
                share_count: post.share_count + 1,
                is_shared_by_user: true, // Mark the post as shared by the user
              }
            : post
        ),
      }));

      // Track the share action visually by changing the state
      setShareClicked(true);
      setTimeout(() => setShareClicked(false), 1000); // Reset after 1 second
    } catch (err) {
      console.log(err); // Log any errors during the share action
    }
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && postPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={event} />
      </Link>
      <Card.Body>
        {event && date && time && (
          <Card.Title className="text-center">
            <i className="fa-solid fa-drum"></i>: {event} -{" "}
            <i className="fa-regular fa-calendar"></i>: {date},{" "}
            <i className="fa-regular fa-clock"></i> {time}
          </Card.Title>
        )}
        {location && (
          <Card.Text>
            <i className="fa-solid fa-location-dot"></i> {location}
          </Card.Text>
        )}
        {description && <Card.Text>{description}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
          {/* Share Icon and Count */}
          {currentUser ? (
            <span onClick={handleShare}>
              <OverlayTrigger
                placement="top"
                overlay={
                  is_shared_by_user ? (
                    <Tooltip>
                      Sorry, you cannot share a post more than once
                    </Tooltip>
                  ) : (
                    <Tooltip>Click to share this post</Tooltip>
                  )
                }
              >
                <i
                  className={`fa-solid fa-share ${
                    shareClicked
                      ? styles.ShareClicked
                      : is_shared_by_user
                      ? styles.ShareDisabled
                      : styles.Share
                  }`}
                />
              </OverlayTrigger>
              {share_count}
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to share posts!</Tooltip>}
            >
              <i className="fa-solid fa-share" />
            </OverlayTrigger>
          )}
        </div>
        <div className={styles.PostBar}>
          {currentUser ? (
            <Button
              variant="outline-danger"
              className="mt-2"
              onClick={() => setShowReportModal(true)}
            >
              Report
            </Button>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to report posts!</Tooltip>}
            >
              <span className="mt-2">
                <Button variant="outline-danger" disabled>
                  Report
                </Button>
              </span>
            </OverlayTrigger>
          )}
        </div>
      </Card.Body>

      {/* ReportForm Component */}
      <ReportForm
        postId={id}
        show={showReportModal}
        handleClose={() => setShowReportModal(false)}
      />
    </Card>
  );
};

export default Post;
