import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

/**
 * Custom hook to handle redirection based on user authentication status.
 * It checks the user's authentication state and redirects to the appropriate route.
 *
 * @param {string} userAuthStatus - The user's authentication status, either 'loggedIn' or 'loggedOut'.
 *
 * @returns {void} - This hook does not return any value, but triggers navigation based on authentication status.
 */
export const useRedirect = (userAuthStatus) => {
  const history = useHistory(); // The useHistory hook to navigate programmatically

  useEffect(() => {
    /**
     * Checks if the user's token is still valid and redirects based on the user's authentication status.
     * If the user is logged in, they are redirected to the homepage.
     * If the user is logged out, they are redirected to the homepage.
     *
     * If the refresh token request fails, it indicates the user is logged out.
     */
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/"); // Attempt to refresh the token
        // If the user is logged in, redirect them to the homepage
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // If the user is not logged in, redirect them to the homepage
        if (userAuthStatus === "loggedOut") {
          history.push("/");
        }
      }
    };

    handleMount(); // Invoke the function to check auth status and handle redirection
  }, [history, userAuthStatus]); // Dependencies: rerun the effect when the auth status or history changes
};
