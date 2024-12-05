import React, { useEffect, useRef, useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { Spinner, Alert, Container, Collapse } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils"; // Ensure this function is correctly imported
import { useCurrentUser } from "../../contexts/CurrentUserContext"; // Import the context hook
import styles from "../../styles/ProfileSharedPosts.module.css"; // Customized styles
import appStyles from "../../App.module.css"; // Global styles

/**
 * ProfileSharedPosts component displays a list of posts shared by the logged-in user.
 * It allows infinite scrolling and collapsible sections to view posts.
 *
 * @param {Object} props - The component props
 * @param {string} props.message - A message to display if no shared posts are available
 * @param {boolean} props.mobile - Flag to determine if the layout is for mobile
 */
const ProfileSharedPosts = ({ message, mobile }) => {
  const [sharedPosts, setSharedPosts] = useState({ results: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef(null);
  
  const currentUser = useCurrentUser(); // Get the current logged-in user from the context

  useEffect(() => {
    const fetchSharedPosts = async () => {
      if (!currentUser) return; // Wait until the user is fetched

      try {
        const { data: postsData } = await axiosRes.get("/shared-posts/");
        
        // Filter posts to show only those shared by the logged-in user
        const filteredPosts = postsData.results.filter((post) =>
          post.shared_by.includes(currentUser.username) // Use the current user's username
        );
        
        setSharedPosts({ results: filteredPosts });
      } catch (err) {
        setError("Failed to load your shared posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedPosts();
  }, [currentUser]); // Re-fetch posts when currentUser changes

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [sharedPosts]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile ? "d-lg-none text-center mb-3" : ""
      }`}
    >
      <div
        className="text-center"
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
      >
        <p>
          <i className="fa-solid fa-share"></i> My Shared Posts
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
                      {/* Display only the logged-in user's name if they are in the shared_by list */}
                      Shared by{" "}
                      <strong>
                        {post.shared_by.includes(currentUser.username)
                          ? currentUser.username
                          : ""}
                      </strong>
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
