import React, { useState } from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";
import styles from "../../styles/Comment.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    description,
    id,
    setPost,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false); // State to toggle comment edit form
  const currentUser = useCurrentUser(); // Get current user context
  const is_owner = currentUser?.username === owner; // Check if current user is the owner of the comment

  /**
   * Handles deleting the comment by making a DELETE request to the backend.
   * Updates the post's comments count and the list of comments after deletion.
   */
  const handleDelete = async () => {
    try {
      // Make a DELETE request to remove the comment
      await axiosRes.delete(`/comments/${id}/`);

      // Update the post data by decrementing the comments count
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));

      // Remove the deleted comment from the list of comments
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      // Handle any errors (e.g., log error)
    }
  };

  return (
    <>
      <hr />
      <Media>
        {/* Link to the profile of the comment owner */}
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          {/* Display comment owner's name and timestamp */}
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          
          {/* If editing, show the edit form, else display the comment description */}
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              description={description}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{description}</p>
          )}
        </Media.Body>

        {/* Show the MoreDropdown for the owner to edit or delete the comment */}
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)} // Toggle edit form visibility
            handleDelete={handleDelete} // Handle comment deletion
          />
        )}
      </Media>
    </>
  );
};

export default Comment;
