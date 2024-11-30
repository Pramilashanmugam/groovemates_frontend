import React, { useEffect, useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import appStyles from "../../App.module.css"; // Use the global styles
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

const ProfileSharedPosts = ({ profileId, message, mobile }) => {
  const [sharedPosts, setSharedPosts] = useState({ results: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null); // Track the profile data

  useEffect(() => {
    const fetchProfileDataAndSharedPosts = async () => {
      try {
        // Fetch profile data to get the profile owner's username
        const { data: profileData } = await axiosRes.get(`/profiles/${profileId}/`);
        setProfile(profileData);

        // Fetch shared posts for the profile
        const { data: postsData } = await axiosRes.get(`/shared-posts/?profile_id=${profileId}`);
        // Filter posts to only show those shared by the profile owner (profile.owner)
        const filteredPosts = postsData.results.filter(post => post.shared_by === profileData.owner);

        setSharedPosts({ results: filteredPosts });
      } catch (err) {
        setError("Failed to load shared posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileDataAndSharedPosts();
  }, [profileId]);

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
    <Container
      className={`${appStyles.Content} ${mobile && "d-lg-none text-center mb-3"}`}
    >
      <Row className="h-100">
        <Col lg={8} className="py-2 p-0 p-lg-2">
          <h2 className="text-center">Posts Shared by {profile?.owner}</h2>
          {sharedPosts.results.length ? (
            <InfiniteScroll
              dataLength={sharedPosts.results.length}
              next={() => fetchMoreData(sharedPosts, setSharedPosts)}
              hasMore={!!sharedPosts.next}
              loader={<Spinner animation="border" />}
            >
              {mobile ? (
                <div className="d-flex justify-content-around">
                  {sharedPosts.results.slice(0, 4).map((post) => (
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
                </div>
              ) : (
                sharedPosts.results.map((post) => (
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
                ))
              )}
            </InfiniteScroll>
          ) : (
            <p className="text-center text-muted">{message}</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileSharedPosts;
