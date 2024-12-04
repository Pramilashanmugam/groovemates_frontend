import React from "react"; // Importing React to create components
import Dropdown from "react-bootstrap/Dropdown"; // Importing Dropdown component from react-bootstrap
import styles from "../styles/MoreDropdown.module.css"; // Importing custom CSS styles for dropdown
import { useHistory } from "react-router"; // Importing useHistory for navigation

/**
 * DropDown component used as a custom toggle for the dropdown menu.
 * It renders a caret-down icon and passes the onClick event to the parent component.
 *
 * @param {Object} props - Properties passed to the DropDown component.
 * @param {Function} props.onClick - Callback function to handle the onClick event.
 * @param {React.Ref} ref - Reference for the dropdown component to handle positioning.
 * @returns {JSX.Element} - The rendered dropdown toggle element.
 */
const DropDown = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fa-solid fa-caret-down" // Icon for the dropdown toggle
    ref={ref} // Forwarded ref to the DOM node for positioning
    onClick={(e) => {
      e.preventDefault(); // Prevent the default action of the event
      onClick(e); // Call the onClick function passed as a prop
    }}
  />
));

/**
 * MoreDropdown component renders a dropdown menu with options to edit or delete.
 *
 * @param {Object} props - Properties passed to the MoreDropdown component.
 * @param {Function} props.handleEdit - Callback function to handle the edit action.
 * @param {Function} props.handleDelete - Callback function to handle the delete action.
 * @returns {JSX.Element} - The rendered dropdown menu for more actions.
 */
export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      {" "}
      {/* The dropdown is aligned to the right */}
      <Dropdown.Toggle as={DropDown} /> {/* Custom dropdown toggle */}
      <Dropdown.Menu
        className="text-center" // Center align the dropdown items
        popperConfig={{ strategy: "fixed" }} // Position the dropdown fixed, preventing auto-placement
      >
        {/* Dropdown Item for Edit action */}
        <Dropdown.Item
          className={styles.DropdownItem} // Applying custom CSS styles
          onClick={handleEdit} // Trigger the handleEdit callback when clicked
          aria-label="edit" // Accessible label for screen readers
        >
          <i className="fas fa-edit" /> {/* Edit icon */}
        </Dropdown.Item>
        {/* Dropdown Item for Delete action */}
        <Dropdown.Item
          className={styles.DropdownItem} // Applying custom CSS styles
          onClick={handleDelete} // Trigger the handleDelete callback when clicked
          aria-label="delete" // Accessible label for screen readers
        >
          <i className="fas fa-trash-alt" />{" "}
          {/* Trash icon for delete action */}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

/**
 * ProfileEditDropdown component renders a dropdown for profile-related actions.
 * It includes options to edit the profile, username, or password.
 *
 * @param {Object} props - Properties passed to the ProfileEditDropdown component.
 * @param {string} props.id - The user profile ID used to build the edit links.
 * @returns {JSX.Element} - The rendered dropdown menu for profile editing actions.
 */
export const ProfileEditDropdown = ({ id }) => {
  const history = useHistory(); // Initialize useHistory hook for navigation

  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      {" "}
      {/* Dropdown with absolute positioning */}
      <Dropdown.Toggle as={Dropdown} /> {/* Default dropdown toggle */}
      <Dropdown.Menu>
        {/* Dropdown Item for editing the profile */}
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)} // Navigate to edit profile page
          aria-label="edit-profile" // Accessible label for screen readers
        >
          <i className="fas fa-edit" /> edit profile{" "}
          {/* Edit icon for profile */}
        </Dropdown.Item>
        {/* Dropdown Item for changing the username */}
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)} // Navigate to edit username page
          aria-label="edit-username" // Accessible label for screen readers
        >
          <i className="far fa-id-card" /> change username {/* Username icon */}
        </Dropdown.Item>
        {/* Dropdown Item for changing the password */}
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)} // Navigate to edit password page
          aria-label="edit-password" // Accessible label for screen readers
        >
          <i className="fas fa-key" /> change password{" "}
          {/* Key icon for password */}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
