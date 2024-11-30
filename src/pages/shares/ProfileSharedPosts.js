import React, { useEffect, useRef, useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { Spinner, Alert, Container, Collapse } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import styles from "../../styles/ProfileSharedPosts.module.css"; // Customized styles
import appStyles from "../../App.module.css"; // Global styles

const ProfileSharedPosts = ({ profileId, message, mobile }) => {
  const [sharedPosts, setSharedPosts] = useState({ results: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef(null); // Ref for scrollable container

  // Fetch Profile Data and Shared Posts
  useEffect(() => {
    const fetchProfileDataAndSharedPosts = async () => {
      try {
        const { data: profileData } = await axiosRes.get(`/profiles/${profileId}/`);
        setProfile(profileData);

        const { data: postsData } = await axiosRes.get(`/shared-posts/?profile_id=${profileId}`);
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

  // Automatically scroll to bottom when new posts are loaded
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [sharedPosts]);

  // Toggle Collapse functionality for posts section
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container
      className={`${appStyles.Content} ${mobile ? "d-lg-none text-center mb-3" : ""}`}
    >
      <div className="text-center" onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        <p>
          <i className="fa-solid fa-share" ></i> {profile?.owner}'s shared posts
        </p>
      </div>
      <hr />
      <Collapse in={!isCollapsed}>
        <div
          ref={scrollContainerRef}
          className={`${appStyles.ScrollableContainer} ${styles.ScrollableContainer}`}
        >
          {sharedPosts.results.length ? (
            <InfiniteScroll
              dataLength={sharedPosts.results.length}
              next={() => fetchMoreData(sharedPosts, setSharedPosts)}
              hasMore={!!sharedPosts.next}
              loader={<Spinner animation="border" />}
              scrollableTarget="scrollableDiv"
            >
              {sharedPosts.results.map((post) => (
                <div key={post.id} className="mb-4">
                  <p className="text-muted">
                    <small>
                      Shared by <strong>{post.shared_by}</strong>
                    </small>
                  </p>
                  <Post {...post} />
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <p className="text-center text-muted">{message}</p>
          )}
        </div>
      </Collapse>
    </Container>
  );
};

export default ProfileSharedPosts;
