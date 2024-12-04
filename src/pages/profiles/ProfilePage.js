import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import ProfileSharedPosts from "../shares/ProfileSharedPosts";

/**
 * ProfilePage displays a user's profile information, including their
 * posts, followers, and following. It fetches data about the user's
 * profile and posts, and provides options for following/unfollowing.
 */
function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const { id } = useParams(); // Profile ID from the URL
  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  // Fetch profile and posts data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data and posts in parallel
        const [{ data: pageProfile }, { data: profilePosts }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/posts/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] }, // Update the profile data in context
        }));
        setProfilePosts(profilePosts); // Update the profile posts state
        setHasLoaded(true); // Set the loaded state to true
      } catch (err) {
        console.log(err); // Log errors if any
      }
    };
    fetchData();
  }, [id, setProfileData]);

  /**
   * Renders the main profile section with user information like name,
   * follower count, and follow/unfollow buttons.
   */
  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={3} className="my-2">
              <div>{profile?.posts_count}</div>
              <div>posts</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.followers_count}</div>
              <div>followers</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.following_count}</div>
              <div>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(profile)} // Handle unfollow
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)} // Handle follow
              >
                follow
              </Button>
            ))}
        </Col>
        {profile?.description && (
          <Col className="p-3">{profile.description}</Col> // Display bio description
        )}
      </Row>
    </>
  );

  /**
   * Renders the profile's posts using InfiniteScroll for pagination.
   */
  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />} // Show spinner while loading
          hasMore={!!profilePosts.next} // Check if there are more posts to load
          next={() => fetchMoreData(profilePosts, setProfilePosts)} // Load more posts when triggered
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`} // Display message if no posts are found
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />{" "}
        {/* Display popular profiles in mobile view */}
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile} {/* Display main profile data */}
              {mainProfilePosts} {/* Display profile posts */}
            </>
          ) : (
            <Asset spinner /> // Show loading spinner if data hasn't loaded yet
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles /> {/* Display popular profiles in desktop view */}
        {/* Profile's Shared Posts */}
        <ProfileSharedPosts profileId={id} message="No shared posts yet." />
      </Col>
    </Row>
  );
}

export default ProfilePage;
