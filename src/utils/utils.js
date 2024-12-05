import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

/**
 * Fetches more data for a given resource and updates the resource state.
 * This function handles pagination and ensures no duplicate results are added.
 * 
 * @param {Object} resource - The current resource with pagination data.
 * @param {Function} setResource - The state setter function to update the resource state.
 */
export const fetchMoreData = async (resource, setResource) => {
  try {
    // Fetch the next page of data from the API
    const { data } = await axiosReq.get(resource.next);
    
    // Update the resource with the new results while preserving unique entries
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next, // Update the next page URL
      results: data.results.reduce((acc, cur) => {
        // Prevent duplicates by checking for existing entries
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results), // Merge the old and new results
    }));
  } catch (err) {
    // Catch any errors (currently no error handling in the function)
  }
};

/**
 * Helper function to update the profile's followers and following count
 * when a user follows a profile.
 * 
 * @param {Object} profile - The profile being updated.
 * @param {Object} clickedProfile - The profile that was clicked to follow.
 * @param {number} following_id - The ID of the profile the user is following.
 * @returns {Object} - The updated profile object.
 */
export const followHelper = (profile, clickedProfile, following_id) => {
  return profile.id === clickedProfile.id
    ? // This is the profile I clicked on,
      // update its followers count and set its following ID
      {
        ...profile,
        followers_count: profile.followers_count + 1, // Increase followers count
        following_id, // Set the following ID to the clicked profile
      }
    : profile.is_owner
    ? // This is the profile of the logged-in user
      // Update its following count (not followers count)
      { ...profile, following_count: profile.following_count + 1 }
    : // This is neither the clicked profile nor the logged-in user's profile
      // Return it unchanged
      profile;
};

/**
 * Helper function to update the profile's followers and following count
 * when a user unfollows a profile.
 * 
 * @param {Object} profile - The profile being updated.
 * @param {Object} clickedProfile - The profile that was clicked to unfollow.
 * @returns {Object} - The updated profile object.
 */
export const unfollowHelper = (profile, clickedProfile) => {
  return profile.id === clickedProfile.id
    ? // This is the profile I clicked on,
      // update its followers count and remove the following ID
      {
        ...profile,
        followers_count: profile.followers_count - 1, // Decrease followers count
        following_id: null, // Remove the following ID
      }
    : profile.is_owner
    ? // This is the profile of the logged-in user
      // Update its following count (not followers count)
      { ...profile, following_count: profile.following_count - 1 }
    : // This is neither the clicked profile nor the logged-in user's profile
      // Return it unchanged
      profile;
};

/**
 * Decodes the JWT refresh token and stores the token's expiration timestamp
 * in localStorage. This timestamp can be used to check when the token should
 * be refreshed.
 * 
 * @param {Object} data - The data containing the refresh token.
 */
export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp); // Store the token timestamp
};

/**
 * Checks if the refresh token timestamp exists in localStorage,
 * indicating that the token is available and might need refreshing.
 * 
 * @returns {boolean} - True if the refresh token timestamp is available, otherwise false.
 */
export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp"); // Returns true if the timestamp exists
};

/**
 * Removes the refresh token timestamp from localStorage, indicating that
 * the token has either been refreshed or is no longer available.
 */
export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp"); // Remove the timestamp from localStorage
};
