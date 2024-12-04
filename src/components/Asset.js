import React from "react"; // Import React for creating components
import { Spinner } from "react-bootstrap"; // Import Spinner component from React Bootstrap
import styles from "../styles/Asset.module.css"; // Import custom CSS module for styling

/**
 * Asset component displays a spinner, an image, and a message.
 * It conditionally renders based on the props passed.
 *
 * @param {Object} props - The properties passed to the Asset component.
 * @param {boolean} props.spinner - Whether to show a spinner.
 * @param {string} props.src - The source URL of the image to display.
 * @param {string} props.message - The message to display below the image (optional).
 * @returns {JSX.Element} - The rendered Asset component.
 */
const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {/* Conditionally render a spinner if the 'spinner' prop is true */}
      {spinner && <Spinner animation="border" />}

      {/* Conditionally render an image if the 'src' prop is provided */}
      {src && <img src={src} alt={message} />}

      {/* Conditionally render the message if the 'message' prop is provided */}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;
