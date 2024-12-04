import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Post from "./Post";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

/**
 * PostsPage component displays a list of posts with a search bar to filter posts.
 * It uses infinite scrolling to load more posts as the user scrolls down.
 * 
 * @param {string} message - Message to display when no results are found
 * @param {string} filter - Filter criteria for fetching posts (optional)
 */
function PostsPage({ message, filter = "" }) {
  const [posts, setPosts] = useState({ results: [] }); // State to hold fetched posts data
  const [hasLoaded, setHasLoaded] = useState(false); // Flag to track if posts have finished loading
  const { pathname } = useLocation(); // Get the current path of the page

  const [query, setQuery] = useState(""); // State to store the search query

  // Fetch posts when the filter, query, or pathname changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts with query and filter
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
        setPosts(data); // Store the fetched posts in state
        setHasLoaded(true); // Mark that the data has loaded
      } catch (err) {
        console.log(err); // Log any errors during the fetch
      }
    };

    setHasLoaded(false); // Reset the loaded flag before new fetch
    const timer = setTimeout(() => {
      fetchPosts(); // Trigger the fetch after a delay
    }, 1000);

    // Cleanup function to clear the timeout on component unmount or re-render
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname]); // Run effect whenever filter, query, or pathname changes

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* Render popular profiles for mobile view */}
        <PopularProfiles mobile />
        
        {/* Search bar for filtering posts */}
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()} // Prevent form submission
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)} // Update search query state
            type="text"
            className="mr-sm-2"
            placeholder="Search posts"
          />
        </Form>

        {/* Conditional rendering based on whether posts are loaded */}
        {hasLoaded ? (
          <>
            {/* Render posts using InfiniteScroll if posts are available */}
            {posts.results.length ? (
              <InfiniteScroll
                children={posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts} />
                ))}
                dataLength={posts.results.length} // Total number of posts loaded
                loader={<Asset spinner />} // Show spinner while loading more posts
                hasMore={!!posts.next} // Check if there are more posts to load
                next={() => fetchMoreData(posts, setPosts)} // Load more posts
              />
            ) : (
              // Show "No Results" message if no posts are found
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          // Show loading spinner if posts are still being fetched
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>

      {/* Render popular profiles for larger screens (desktop) */}
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostsPage;
