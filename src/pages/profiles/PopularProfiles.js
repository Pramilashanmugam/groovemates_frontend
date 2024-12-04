import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

/**
 * PopularProfiles component displays a list of popular profiles.
 * It can render either a mobile or desktop version of the profile list.
 *
 * @param {boolean} mobile - Flag indicating if the component is being rendered in mobile view
 */
const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData(); // Get popular profiles from context

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {/* Check if there are popular profiles available */}
      {popularProfiles.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {/* Render a mobile version of the profile list */}
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            // Render a desktop version of the profile list
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        // Show a spinner if no popular profiles are available
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;
