import React from "react"; // Import React to create the component
import styles from "../styles/Avatar.module.css"; // Import custom CSS module for styling

/**
 * Avatar component displays a user's avatar image and optional text.
 * The avatar image has a default height and width, which can be customized.
 *
 * @param {Object} props - The properties passed to the Avatar component.
 * @param {string} props.src - The source URL of the avatar image.
 * @param {number} [props.height=45] - The height (and width) of the avatar image (default is 45px).
 * @param {string} [props.text] - Optional text that can be displayed next to the avatar.
 * @returns {JSX.Element} - The rendered Avatar component.
 */
const Avatar = ({ src, height = 45, text }) => {
  return (
    <span>
      {/* Avatar image with dynamic height and width, and a default alt text */}
      <img
        className={styles.Avatar} // Applying custom styles for avatar
        src={src} // Source URL for the avatar image
        height={height} // Height of the avatar (can be customized)
        width={height} // Width matches height to keep the avatar circular
        alt="avatar" // Alt text for the image
      />
      {/* Conditionally render the text next to the avatar, if provided */}
      {text}
    </span>
  );
};

export default Avatar;
