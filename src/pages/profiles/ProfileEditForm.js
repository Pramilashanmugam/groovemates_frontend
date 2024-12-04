import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import inputStyles from "../../styles/ProfilePage.module.css";

/**
 * ProfileEditForm allows the current user to edit their profile information,
 * including the name, bio, and image. It fetches the current user's profile
 * data, updates it, and then submits the changes to the server.
 */
const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams(); // Profile ID from URL
  const history = useHistory();
  const imageFile = useRef();

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const { name, description, image } = profileData;

  // Errors state
  const [errors, setErrors] = useState({});

  // Fetch the profile data when the component mounts
  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { name, description, image } = data;
          setProfileData({ name, description, image });
        } catch (err) {
          console.log(err);
          history.push("/"); // Redirect if an error occurs
        }
      } else {
        history.push("/"); // Redirect if the user tries to access another user's profile
      }
    };

    handleMount();
  }, [currentUser, history, id]);

  /**
   * Handles changes to form fields and updates the profileData state.
   * @param {Event} event - The change event triggered by the form input.
   */
  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Handles form submission by sending the updated profile data to the server.
   * It also handles image file uploads via FormData.
   * @param {Event} event - The submit event triggered by the form.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    // Append the new image if selected
    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image, // Update current user's profile image
      }));
      history.goBack(); // Go back to the previous page after saving
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data); // Handle errors from the server
    }
  };

  // Render the text fields (bio, save and cancel buttons)
  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={description}
          onChange={handleChange}
          name="description"
          rows={7}
        />
      </Form.Group>

      {/* Display errors related to the bio field */}
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Cancel and Save buttons */}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              {/* Display current profile image */}
              {image && (
                <figure>
                  <Image src={image} fluid />
                </figure>
              )}

              {/* Display errors related to the image field */}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              {/* File input for changing the profile image */}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                className={inputStyles.FileInput}
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            {/* Render text fields for mobile view */}
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;
