import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/CommentCreateEditForm.module.css";

function CommentEditForm(props) {
  const { id, description, setShowEditForm, setComments } = props;

  // State to manage the updated description for the comment
  const [formDescription, setFormDescription] = useState(description);

  /**
   * Handles changes to the comment description input field.
   * Updates the formDescription state with the current input value.
   * @param {Event} e - The event object from the input change.
   */
  const handleChange = (e) => {
    setFormDescription(e.target.value);
  };

  /**
   * Handles the form submission to update the comment.
   * Sends a PUT request to update the comment and updates the comments list.
   * @param {Event} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a PUT request to update the comment
      await axiosRes.put(`/comments/${id}/`, {
        description: formDescription.trim(),
      });

      // Update the comments list with the new description
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                description: formDescription.trim(),
                updated_at: "now", // Optionally, this could be the actual updated timestamp
              }
            : comment;
        }),
      }));

      // Close the edit form after saving
      setShowEditForm(false);
    } catch (err) {
      console.log(err); // Log any errors that occur during the request
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        {/* Textarea for editing the comment description */}
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formDescription}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        {/* Cancel button to close the edit form without saving */}
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        {/* Save button to submit the edited comment */}
        <button
          className={styles.Button}
          disabled={!formDescription.trim()} // Disables button if input is empty or only whitespace
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
