import React from "react";
import Asset from "./Asset"; // Assuming Asset component is in the same folder or adjust accordingly
import NoResults from "../assets/no-results.png"; // Importing the no-results image
import styles from "../styles/NotFound.module.css"; // Importing the CSS file for styling

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <Asset
        src={NoResults}
        message="Sorry, the page you're looking for doesn't exist"
      />
    </div>
  );
};

export default NotFound;
