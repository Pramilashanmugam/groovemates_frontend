import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

/**
 * UsernameForm allows users to update their username.
 * It fetches the current user's username on mount and provides a form to change it.
 */
const UsernameForm = () => {
  const [username, setUsername] = useState(""); // State to manage username input
  const [errors, setErrors] = useState({}); // State to manage form validation errors

  const history = useHistory();
  const { id } = useParams(); // Gets the user ID from the URL

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // Fetch and set current username if the logged-in user matches the profile ID
  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username); // Set the current username to the input field
    } else {
      history.push("/"); // Redirect to home if the profile doesn't match
    }
  }, [currentUser, history, id]);

  /**
   * Handles the form submission to update the username.
   * If successful, updates the username in the context and navigates back.
   *
   * @param {Event} e - The submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      history.goBack(); // Navigate back after successful update
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data); // Set validation errors if any
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update username on change
              />
            </Form.Group>
            {/* Display errors related to username */}
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            {/* Cancel button to go back */}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => history.goBack()}
            >
              cancel
            </Button>
            {/* Submit button to save the new username */}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              type="submit"
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;
