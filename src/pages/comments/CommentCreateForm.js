import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
  const {
    post,
    setPost,
    setComments,
    profileImage,
    profile_id,
    parent = null, // Optional parent comment ID for replies
    addReplyToParent, // Function to update parent comment replies
  } = props;
  const [description, setdescription] = useState("");

  const handleChange = (e) => {
    setdescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", {
        description,
        post,
        parent, // Include the parent comment ID for replies
      });

      if (parent) {
        // If it's a reply, update the parent comment's replies
        addReplyToParent(data);
      } else {
        // If it's a top-level comment, update the comments list
        setComments((prevComments) => ({
          ...prevComments,
          results: [data, ...prevComments.results],
        }));

        // Update the post's comment count
        setPost((prevPost) => ({
          results: [
            {
              ...prevPost.results[0],
              comments_count: prevPost.results[0].comments_count + 1,
            },
          ],
        }));
      }

      setdescription(""); // Clear the input field
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder={
              parent ? "Write a reply..." : "Write a comment..."
            } // Different placeholder for replies
            as="textarea"
            value={description}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} btn d-block ml-auto`}
        disabled={!description.trim()}
        type="submit"
      >
        {parent ? "Reply" : "Post"} {/* Change button text for replies */}
      </button>
    </Form>
  );
}

export default CommentCreateForm;
