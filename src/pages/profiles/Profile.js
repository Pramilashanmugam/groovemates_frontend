import React from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { Button } from "react-bootstrap";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

/**
 * Profile component displays individual profile details including the user's avatar,
 * username, and a follow/unfollow button (if applicable).
 *
 * @param {Object} props - The props passed to the Profile component.
 * @param {Object} props.profile - The profile data.
 * @param {boolean} [props.mobile] - Whether the component is rendered for mobile.
 * @param {number} [props.imageSize=55] - The size of the profile image (default: 55px).
 */
const Profile = (props) => {
  const { profile, mobile, imageSize = 55 } = props;
  const { id, following_id, image, owner } = profile;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const { handleFollow, handleUnfollow } = useSetProfileData();

  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      {/* Avatar with link to profile */}
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        {/* Display profile owner username */}
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {/* Conditionally render the follow/unfollow button */}
        {!mobile &&
          currentUser &&
          !is_owner &&
          (following_id ? (
            // If the user is already following, show "unfollow" button
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => handleUnfollow(profile)}
            >
              unfollow
            </Button>
          ) : (
            // If the user is not following, show "follow" button
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={() => handleFollow(profile)}
            >
              follow
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Profile;
