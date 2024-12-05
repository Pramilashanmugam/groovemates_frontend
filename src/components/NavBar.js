import React from "react"; // Importing React to use JSX and component functionality
import { Navbar, Container, Nav } from "react-bootstrap"; // Importing Navbar components from react-bootstrap
import logo from "../assets/logo.png"; // Importing the logo image for the Navbar
import styles from "../styles/NavBar.module.css"; // Importing custom CSS styles for the Navbar
import { NavLink } from "react-router-dom"; // Importing NavLink for navigation
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext"; // Importing context hooks for current user management
import Avatar from "./Avatar"; // Importing Avatar component to display the user's profile image
import axios from "axios"; // Importing axios for API calls
import useClickOutsideToggle from "../hooks/useClickOutsideToggle"; // Importing a custom hook for toggling dropdown on outside click
import { removeTokenTimestamp } from "../utils/utils";

/**
 * NavBar component renders the navigation bar for the website.
 * It conditionally renders different links depending on whether a user is logged in or not.
 *
 * - Displays a logo, a link to add a post, and various other links based on the user's authentication status.
 * - Includes functionality to log the user out, handle dropdown toggles, and navigate to various pages.
 *
 * @returns {JSX.Element} - The rendered navigation bar component.
 */
const NavBar = () => {
  const currentUser = useCurrentUser(); // Get the current user context
  const setCurrentUser = useSetCurrentUser(); // Function to set current user context

  const { expanded, setExpanded, ref } = useClickOutsideToggle(); // Toggle state for collapsing navbar on outside click

  /**
   * handleSignOut function logs out the current user by making an API call and clearing the user context.
   */
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/"); // Post request to log out the user
      setCurrentUser(null); // Clear the current user context
      removeTokenTimestamp();
    } catch (err) {
      console.log(err); // Log any errors encountered during the logout process
    }
  };

  // Icon for adding a new post link, displayed only when user is logged in
  const addPostIcon = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/posts/create"
    >
      <i className="far fa-plus-square"></i>Add post
    </NavLink>
  );

  // Links displayed when the user is logged in
  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/feed"
      >
        <i className="fas fa-stream"></i>Feed
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>Liked
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/shared"
      >
        <i className="fa-solid fa-share"></i>SharedPosts
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>
    </>
  );

  // Links displayed when the user is logged out
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded} // Controls whether the Navbar is expanded or collapsed
      className={styles.NavBar} // Applying custom styles to the Navbar
      expand="md" // Makes the Navbar collapse on smaller screens
      fixed="top" // Keeps the Navbar fixed at the top of the screen
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" /> {/* Navbar logo */}
          </Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}{" "}
        {/* Only show 'Add post' if the user is logged in */}
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)} // Toggle the navbar expansion on click
          aria-controls="basic-navbar-nav" // For accessibility
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              <i className="fas fa-home"></i>Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}{" "}
            {/* Show logged-in or logged-out icons based on the user state */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
