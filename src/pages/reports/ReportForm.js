import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosRes } from "../../api/axiosDefaults";

function ReportForm({ postId, show, handleClose }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosRes.post("/reports/", {
        post: postId,
        reason,
        description,
      });
      alert("Report submitted successfully and it will be reviewed by the admin soon");
      handleClose();
    } catch (err) {
      console.error(err);
      alert("There was an error submitting the report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Report Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="reason">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Details (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            className="mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ReportForm;
