import React, { useEffect, useState } from "react";
import { axiosRes } from "../../api/axiosDefaults";
import Post from "../posts/Post";
import { Spinner, Alert } from "react-bootstrap";
import styles from "../../styles/SharedPosts.module.css";

const SharedPosts = () => {
  const [sharedPosts, setSharedPosts] = useState({ results: [] });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharedPosts = async () => {
      try {
        const { data } = await axiosRes.get("/shared-posts/");
        setSharedPosts(data);
      } catch (err) {
        setError("Failed to load shared posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedPosts();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>;
  }

  return (
    <div className={styles.sharedPostsContainer}>
      <h2 className={styles.sharedPostsTitle}>Shared Posts</h2>
      {sharedPosts.results.length ? (
        sharedPosts.results.map((post) => (
          <div key={post.id} className={styles.sharedPostItem}>
            <Post {...post} />
          </div>
        ))
      ) : (
        <p className={styles.noSharedPosts}>You haven't shared any posts yet.</p>
      )}
    </div>
  );
};

export default SharedPosts;
