import { axiosReq } from "../api/axiosDefaults";

/**
 * Fetches more data for a given resource and updates the state with the new data.
 * It ensures no duplicate results are added to the resource list.
 *
 * @param {Object} resource - The resource object containing the current data and next page URL.
 * @param {Function} setResource - Function to update the state with the new resource data.
 */
export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);

    // Update the resource with new data, ensuring no duplicates in the 'results' array
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next, // Update the 'next' URL for pagination
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id) // Check for duplicate results
          ? acc
          : [...acc, cur]; // Add unique result to the accumulator
      }, prevResource.results), // Preserve the previous results and append unique new data
    }));
  } catch (err) {
    // No error handling here, could log or show a message in the future
  }
};

/**
 * Helper function to update a profile when following another user.
 * It updates the follower count and setting the `following_id` for the profile.
 *
 * @param {Object} profile - The profile that is being updated.
 * @param {Object} clickedProfile - The profile that the user clicked on to follow.
 * @param {number} following_id - The ID of the user who is being followed.
 * @returns {Object} - The updated profile.
 */
export const followHelper = (profile, clickedProfile, following_id) => {
  return profile.id === clickedProfile.id
    ? // This is the profile I clicked on, update its followers count and following_id
      {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : profile.is_owner
    ? // This is the profile of the logged-in user, update its following count
      { ...profile, following_count: profile.following_count + 1 }
    : // This is neither the clicked profile nor the logged-in user's profile, return unchanged
      profile;
};

/**
 * Helper function to update a profile when unfollowing another user.
 * It updates the follower count and removes the `following_id` for the profile.
 *
 * @param {Object} profile - The profile that is being updated.
 * @param {Object} clickedProfile - The profile that the user clicked on to unfollow.
 * @returns {Object} - The updated profile.
 */
export const unfollowHelper = (profile, clickedProfile) => {
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count - 1,
        following_id: null, // Remove following_id as the user is no longer followed
      }
    : profile.is_owner
    ? { ...profile, following_count: profile.following_count - 1 } // Decrease following count if it's the logged-in user's profile
    : profile; // Return unchanged if it's neither the clicked profile nor the logged-in user
};
