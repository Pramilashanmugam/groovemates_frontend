import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

// Creating context for the current user and a function to update it
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

/**
 * Custom hook to access the current user context.
 * @returns {object|null} - The current user object or null if no user is logged in.
 */
export const useCurrentUser = () => useContext(CurrentUserContext);

/**
 * Custom hook to access the function to update the current user context.
 * @returns {function} - Function to update the current user.
 */
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

/**
 * CurrentUserProvider component provides the current user context
 * to the rest of the app.
 *
 * It handles:
 * - Fetching the user data when the component mounts
 * - Setting up Axios interceptors for handling authentication state
 * - Managing the user session (logging out when necessary)
 *
 * @param {object} props - The component props, including the children to be rendered.
 * @returns {JSX.Element} - The rendered context providers wrapping the children.
 */
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to store current user data
  const history = useHistory(); // Hook to programmatically navigate

  /**
   * handleMount function fetches user data when the component mounts.
   */
  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/"); // Fetch user data
      setCurrentUser(data); // Set the current user in the state
    } catch (err) {
      console.log(err); // Log error if fetching user data fails
    }
  };

  // Run handleMount when the component first mounts
  useEffect(() => {
    handleMount();
  }, []);

  /**
   * useMemo hook sets up interceptors to handle token refresh
   * and manage user session.
   * - Request interceptor: Tries to refresh the token on each request.
   * - Response interceptor: Tries to refresh the token if the response is 401 (Unauthorized).
   */
  useMemo(() => {
    // Request interceptor to refresh token
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/"); // Try to refresh token
          } catch (err) {
            // If token refresh fails, log out the user and redirect to sign-in
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            removeTokenTimestamp();
            return config; // Return config to continue the request
          }
        }
        return config; // Return config if token refresh is successful
      },
      (err) => {
        return Promise.reject(err); // Reject if any error occurs
      }
    );

    // Response interceptor to handle 401 Unauthorized errors
    axiosRes.interceptors.response.use(
      (response) => response, // Return the response if successful
      async (err) => {
        if (err.response?.status === 401) {
          // Check if error is Unauthorized
          try {
            await axios.post("/dj-rest-auth/token/refresh/"); // Try to refresh the token
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin"); // Redirect to sign-in if token refresh fails
              }
              return null; // Clear the user context
            });
            removeTokenTimestamp();
          }
          return axios(err.config); // Retry the original request after token refresh
        }
        return Promise.reject(err); // Reject if error is not 401
      }
    );
  }, [history]); // Effect depends on history to manage redirection

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children} {/* Render children within the context providers */}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
