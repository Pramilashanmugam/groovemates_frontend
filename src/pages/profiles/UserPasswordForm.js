import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

/**
 * UserPasswordForm allows users to change their password.
 * It validates that the current user is authorized to change the password and submits the data to update the password.
 */
const UserPasswordForm = () => {
  const history = useHistory();
  const { id } = useParams(); // Retrieves the profile ID from the URL parameters
  const currentUser = useCurrentUser(); // Gets the current logged-in user

  // State for managing form data and errors
  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;
  const [errors, setErrors] = useState({}); // State for error messages from the API

  /**
   * Updates userData state on form input change.
   *
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value, // Updates the appropriate field based on the input name
    });
  };

  /**
   * Verifies if the logged-in user matches the profile owner.
   * If not, redirects them to the home page.
   */
  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      history.push("/"); // Redirect to home if the user is not the profile owner
    }
  }, [currentUser, history, id]);

  /**
   * Submits the new password data to the backend.
   * If successful, it navigates back. If there are errors, they are displayed.
   *
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData); // Sends password change request to the backend
      history.goBack(); // Navigate back after successful submission
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data); // Handles any errors and displays them
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit}>
            {/* New Password Input */}
            <Form.Group>
              <Form.Label>New password</Form.Label>
              <Form.Control
                placeholder="new password"
                type="password"
                value={new_password1}
                onChange={handleChange}
                name="new_password1" // Sets field name to identify the input
              />
            </Form.Group>
            {/* Error message for new password */}
            {errors?.new_password1?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            {/* Confirm New Password Input */}
            <Form.Group>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                placeholder="confirm new password"
                type="password"
                value={new_password2}
                onChange={handleChange}
                name="new_password2" // Sets field name to identify the input
              />
            </Form.Group>
            {/* Error message for confirm password */}
            {errors?.new_password2?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            {/* Cancel button */}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => history.goBack()} // Navigate back without making changes
            >
              cancel
            </Button>

            {/* Save button to submit the form */}
            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UserPasswordForm;
