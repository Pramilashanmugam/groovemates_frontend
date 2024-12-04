import React, { useEffect, useRef, useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { Spinner, Alert, Container, Collapse } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import styles from "../../styles/ProfileSharedPosts.module.css"; // Customized styles
import appStyles from "../../App.module.css"; // Global styles

/**
 * ProfileSharedPosts component displays a list of shared posts of a profile.
 * It allows infinite scrolling and collapsible sections to view posts.
 *
 * @param {Object} props - The component props
 * @param {number} props.profileId - The ID of the profile whose shared posts are being displayed
 * @param {string} props.message - A message to display if no shared posts are available
 * @param {boolean} props.mobile - Flag to determine if the layout is for mobile
 */
const ProfileSharedPosts = ({ profileId, message, mobile }) => {
  // State for storing the shared posts data, loading state, and error message
  const [sharedPosts, setSharedPosts] = useState({ results: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // For controlling the collapse state of the posts section
  const scrollContainerRef = useRef(null); // Ref for the scrollable container to manage scroll position

  /**
   * Fetches the profile data and the shared posts for the given profile ID.
   * Filters posts shared by the profile owner and sets the posts and profile data in state.
   */
  useEffect(() => {
    const fetchProfileDataAndSharedPosts = async () => {
      try {
        // Fetch profile data using the profileId
        const { data: profileData } = await axiosRes.get(
          `/profiles/${profileId}/`
        );
        setProfile(profileData);

        // Fetch shared posts related to the profile
        const { data: postsData } = await axiosRes.get(
          `/shared-posts/?profile_id=${profileId}`
        );

        // Filter the shared posts by the profile owner
        const filteredPosts = postsData.results.filter(
          (post) => post.shared_by === profileData.owner
        );
        setSharedPosts({ results: filteredPosts });
      } catch (err) {
        setError("Failed to load shared posts."); // Handle error
      } finally {
        setIsLoading(false); // Set loading state to false after the data is fetched
      }
    };

    fetchProfileDataAndSharedPosts(); // Invoke the function to fetch data
  }, [profileId]);

  /**
   * Automatically scrolls the container to the bottom when new posts are loaded.
   */
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [sharedPosts]); // Triggers whenever new posts are added

  /**
   * Toggles the collapse state of the shared posts section.
   */
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Rendered output: display shared posts or a message if no posts exist
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
          <i className="fa-solid fa-share"></i> {profile?.owner}'s shared posts
        </p>
      </div>
      <hr />
      <Collapse in={!isCollapsed}>
        <div
          ref={scrollContainerRef} // Reference for scrollable container
          className={`${appStyles.ScrollableContainer} ${styles.ScrollableContainer}`}
        >
          {/* Infinite scrolling for shared posts */}
          {sharedPosts.results.length ? (
            <InfiniteScroll
              dataLength={sharedPosts.results.length} // Total number of posts loaded
              next={() => fetchMoreData(sharedPosts, setSharedPosts)} // Function to load more posts
              hasMore={!!sharedPosts.next} // Determines if there are more posts to load
              loader={<Spinner animation="border" />} // Loading indicator
              scrollableTarget="scrollableDiv"
            >
              {sharedPosts.results.map((post) => (
                <div key={post.id} className="mb-4">
                  <p className="text-muted">
                    <small>
                      Shared by <strong>{post.shared_by}</strong>
                    </small>
                  </p>
                  <Post {...post} /> {/* Render individual post */}
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <p className="text-center text-muted">{message}</p> // Message if no posts are found
          )}
        </div>
      </Collapse>
    </Container>
  );
};

export default ProfileSharedPosts;
