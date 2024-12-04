import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import styles from "../../styles/PostCreateEditForm.module.css";
import inputStyles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostEditForm() {
  const [errors, setErrors] = useState({}); // Holds validation errors for the form

  const [postData, setPostData] = useState({
    event: "",
    description: "",
    location: "",
    date: "",
    time: "",
    image: "",
  });
  const { event, description, location, date, time, image } = postData;

  const imageInput = useRef(null); // Reference for the image input field
  const history = useHistory();
  const { id } = useParams(); // Fetch post ID from the URL params

  // Fetch post data on component mount to populate the form
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { event, description, location, date, time, image, is_owner } =
          data;

        // Ensure the current user is the owner of the post, otherwise redirect
        if (is_owner) {
          setPostData({ event, description, location, date, time, image });
        } else {
          history.push("/"); // Redirect to homepage if the user is not the owner
        }
      } catch (err) {
        console.log(err); // Handle errors in fetching post data
      }
    };

    handleMount();
  }, [history, id]);

  // Handles changes in the form inputs
  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles image input change and updates the preview
  const handleChangeImage = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(image); // Revoke previous object URL
      setPostData({
        ...postData,
        image: URL.createObjectURL(e.target.files[0]), // Set the new image URL
      });
    }
  };

  // Handles form submission to update the post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("event", postData.event);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]); // Append image if selected
    }

    try {
      await axiosReq.put(`/posts/${id}/`, formData); // Send PUT request to update the post
      history.push(`/posts/${id}`); // Redirect to the updated post page
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data); // Handle and display validation errors
      }
    }
  };

  // JSX for rendering form fields (event, location, date, time, description)
  const textFields = (
    <div className="text-center">
      {/* Event input field */}
      <Form.Group>
        <Form.Label>Event</Form.Label>
        <Form.Control
          type="text"
          name="event"
          value={event}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.event?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Location input field */}
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={location}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.location?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Date and time input fields */}
      <Form.Group as={Row} className="align-items-center">
        <Col md={6}>
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={date}
            onChange={handleChange}
          />
          {errors?.date?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
        <Col md={6}>
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={time}
            onChange={handleChange}
          />
          {errors?.time?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Form.Group>

      {/* Description input field */}
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="description"
          value={description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      {/* Buttons for cancel and save */}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {/* Display image preview and allow image upload */}
              <figure>
                <Image className={appStyles.Image} src={image} rounded />
              </figure>
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>

              {/* File input for image upload */}
              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
                className={inputStyles.FileInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;
