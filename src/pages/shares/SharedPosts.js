import React, { useEffect, useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { Spinner, Alert, Container, Col, Row } from "react-bootstrap";
import appStyles from "../../App.module.css"; // Use the global styles
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

/**
 * SharedPosts component displays a list of shared posts based on the provided filter.
 * It also handles infinite scrolling and shows a sidebar with popular profiles.
 *
 * @param {Object} props - The component props
 * @param {string} props.message - A message to display if no shared posts are found
 */
const SharedPosts = ({ message }) => {
  const [sharedPosts, setSharedPosts] = useState({ results: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches the shared posts data for all users.
   * Updates state with the fetched posts or error message if the request fails.
   */
  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const { data } = await axiosRes.get('/shared-posts/'); // Fetch all shared posts
        setSharedPosts(data);
      } catch (err) {
        setError("Failed to load shared posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedPosts(); // Fetch the posts when the component mounts
  }, []);

  // Loading state: shows spinner while data is being fetched
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  // Error state: displays an error message if the data fails to load
  if (error) {
    return (
      <Container className={`${appStyles.Content} my-4`}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Row className="h-100">
      {/* Main Content - Displays the shared posts */}
      <Col lg={8} className="py-2 p-0 p-lg-2">
        <Container className={`${appStyles.Content} my-4`}>
          <h2 className="text-center">Shared Posts</h2>
          {sharedPosts.results.length ? (
            <InfiniteScroll
              dataLength={sharedPosts.results.length} // Total number of posts loaded
              next={() => fetchMoreData(sharedPosts, setSharedPosts)} // Function to load more posts
              hasMore={!!sharedPosts.next} // Determines if there are more posts to load
              loader={<Spinner animation="border" />} // Loading indicator
            >
              {sharedPosts.results.map((post) => (
                <div key={post.id} className="mb-4">
                  {/* Display the username who shared the post */}
                  <p className="text-muted">
                    <small>
                      Shared by <strong>{post.shared_by.join(", ")}</strong>
                    </small>
                  </p>
                  {/* Render the Post component */}
                  <Post {...post} setPosts={setSharedPosts} />
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <p className="text-center text-muted">{message}</p> // Message if no posts are found
          )}
        </Container>
      </Col>

      {/* Sidebar with Popular Profiles - Shown only on large screens */}
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
};

export default SharedPosts;
