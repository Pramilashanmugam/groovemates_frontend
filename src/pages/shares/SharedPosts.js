import React, { useEffect, useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { Spinner, Alert, Container, Col, Row } from "react-bootstrap";
import appStyles from "../../App.module.css"; // Use the global styles
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

const SharedPosts = ({ filter, message }) => {
  const [sharedPosts, setSharedPosts] = useState({ results: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const { data } = await axiosRes.get(`/shared-posts/?${filter}`);
        setSharedPosts(data);
      } catch (err) {
        setError("Failed to load shared posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedPosts();
  }, [filter]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className={`${appStyles.Content} my-4`}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Row className="h-100">
      {/* Main Content */}
      <Col lg={8} className="py-2 p-0 p-lg-2">
        <Container className={`${appStyles.Content} my-4`}>
          <h2 className="text-center">Shared Posts</h2>
          {sharedPosts.results.length ? (
            <InfiniteScroll
              dataLength={sharedPosts.results.length}
              next={() => fetchMoreData(sharedPosts, setSharedPosts)}
              hasMore={!!sharedPosts.next}
              loader={<Spinner animation="border" />}
            >
              {sharedPosts.results.map((post) => (
                <div key={post.id} className="mb-4">
                  {/* Display the username who shared the post */}
                  <p className="text-muted">
                    <small>
                      Shared by <strong>{post.shared_by}</strong>                      
                    </small>
                  </p>
                  {/* Render the Post component */}
                  <Post {...post} />
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <p className="text-center text-muted">{message}</p>
          )}
        </Container>
      </Col>

      {/* Sidebar with Popular Profiles */}
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
};

export default SharedPosts;
