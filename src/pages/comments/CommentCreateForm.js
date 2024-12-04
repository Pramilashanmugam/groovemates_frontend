import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
  const { post, setPost, setComments, profileImage, profile_id } = props;
  const [description, setDescription] = useState("");

  /**
   * Handles changes to the comment input field.
   * Updates the description state with the current input value.
   * @param {Event} e - The event object from the input change.
   */
  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  /**
   * Handles the form submission to create a new comment.
   * Sends a POST request to create the comment and updates the comments list and post data.
   * @param {Event} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to create the comment
      const { data } = await axiosRes.post("/comments/", {
        description,
        post,
      });

      // Update the comments list by adding the new comment at the start
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));

      // Update the post data to increment the comment count
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1,
          },
        ],
      }));

      // Clear the comment input after submission
      setDescription("");
    } catch (err) {
      console.log(err); // Log any errors that occur during the request
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          {/* Link to the user's profile */}
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          {/* Textarea for entering the comment */}
          <Form.Control
            className={styles.Form}
            placeholder="my comment..."
            as="textarea"
            value={description}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>

      {/* Submit button for posting the comment, disabled if the description is empty */}
      <button
        className={`${styles.Button} btn d-block ml-auto`}
        disabled={!description.trim()} // Disables button if input is empty
        type="submit"
      >
        post
      </button>
    </Form>
  );
}

export default CommentCreateForm;
