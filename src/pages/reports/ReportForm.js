import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosRes } from "../../api/axiosDefaults";

/**
 * ReportForm component allows users to report a post for inappropriate content.
 * It collects the reason for reporting and an optional description.
 *
 * @param {Object} props - Component props
 * @param {number} props.postId - The ID of the post being reported
 * @param {boolean} props.show - Flag to show or hide the modal
 * @param {Function} props.handleClose - Function to close the modal
 */
function ReportForm({ postId, show, handleClose }) {
  // State for storing the reason, description, and submission status
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles the form submission by sending the report to the backend.
   * It disables the submit button while the report is being processed.
   *
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true); // Disable the submit button during submission

    try {
      // Sends a POST request to submit the report
      await axiosRes.post("/reports/", {
        post: postId,
        reason,
        description,
      });
      alert(
        "Report submitted successfully and it will be reviewed by the admin soon"
      );
      handleClose(); // Close the modal after successful submission
    } catch (err) {
      console.error(err);
      alert("There was an error submitting the report."); // Shows error message in case of failure
    } finally {
      setIsSubmitting(false); // Re-enable the submit button after submission
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Report Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Dropdown to select the reason for reporting */}
          <Form.Group controlId="reason">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="select"
              value={reason}
              onChange={(e) => setReason(e.target.value)} // Update reason state when selection changes
              required
            >
              <option value="">Select a reason</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="abuse">Abuse or Harassment</option>
              <option value="spam">Spam or Misleading</option>
              <option value="hate">Hate Speech</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>

          {/* Optional description field to provide more details */}
          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Details (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)} // Update description state
            />
          </Form.Group>

          {/* Submit button, disables while submitting */}
          <Button
            type="submit"
            variant="primary"
            className="mt-3"
            disabled={isSubmitting} // Button is disabled while submitting
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ReportForm;
