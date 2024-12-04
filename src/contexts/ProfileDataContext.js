import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

// Creating context for profile data and a function to update it
const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

/**
 * Custom hook to access the profile data context.
 * @returns {object} - The current profile data.
 */
export const useProfileData = () => useContext(ProfileDataContext);

/**
 * Custom hook to access the function to update the profile data context.
 * @returns {object} - The function to update the profile data, including follow/unfollow actions.
 */
export const useSetProfileData = () => useContext(SetProfileDataContext);

/**
 * ProfileDataProvider component provides the profile data context
 * to the rest of the app.
 *
 * It handles:
 * - Fetching the profile data on component mount.
 * - Managing follow and unfollow actions for profiles.
 * - Updating the state for both the user's page and popular profiles when follow/unfollow actions occur.
 *
 * @param {object} props - The component props, including the children to be rendered.
 * @returns {JSX.Element} - The rendered context providers wrapping the children.
 */
export const ProfileDataProvider = ({ children }) => {
  // State to store profile data, including the page profile and popular profiles
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const currentUser = useCurrentUser(); // Access the current user from context

  /**
   * handleFollow function handles the action when a user follows another profile.
   * It sends a request to follow the clicked profile and updates the state.
   * @param {object} clickedProfile - The profile being followed.
   */
  const handleFollow = async (clickedProfile) => {
    try {
      // Sending follow request to the API
      const { data } = await axiosRes.post("/followers/", {
        followed: clickedProfile.id,
      });

      // Updating the state with the new follow status
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      console.log(err); // Log error if follow request fails
    }
  };

  /**
   * handleUnfollow function handles the action when a user unfollows a profile.
   * It sends a request to unfollow the clicked profile and updates the state.
   * @param {object} clickedProfile - The profile being unfollowed.
   */
  const handleUnfollow = async (clickedProfile) => {
    try {
      // Sending unfollow request to the API
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

      // Updating the state with the new unfollow status
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      console.log(err); // Log error if unfollow request fails
    }
  };

  /**
   * Fetch the popular profiles when the component mounts and set the data to state.
   */
  useEffect(() => {
    const handleMount = async () => {
      try {
        // Fetching popular profiles, ordered by followers count
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data, // Set the popular profiles data in state
        }));
      } catch (err) {
        console.log(err); // Log error if fetching popular profiles fails
      }
    };

    handleMount(); // Call handleMount when the component mounts
  }, [currentUser]); // Re-run the effect when currentUser changes

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children} {/* Render children within the context providers */}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
