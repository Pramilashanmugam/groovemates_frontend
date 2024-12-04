import { render, screen, fireEvent } from "@testing-library/react"; // Importing testing utilities
import { BrowserRouter as Router } from "react-router-dom"; // For wrapping components that use React Router
import { CurrentUserProvider } from "../../contexts/CurrentUserContext"; // Provides current user context to the component
import NavBar from "../NavBar"; // Importing the NavBar component to test

/**
 * Test case to check if the "NavBar" component renders correctly with Sign In link.
 */
test("renders NavBar", () => {
  // Render the NavBar component wrapped with Router to handle routing
  render(
    <Router>
      <NavBar />
    </Router>
  );

  // Retrieve the 'Sign in' link by its role and name
  const signInLink = screen.getByRole("link", { name: "Sign in" });

  // Assert that the 'Sign in' link is present in the document
  expect(signInLink).toBeInTheDocument();
});

/**
 * Test case to check if the profile link appears for a logged-in user.
 */
test("renders link to the user profile for a logged in user", async () => {
  // Render NavBar with CurrentUserProvider to simulate a logged-in user context
  render(
    <Router>
      <CurrentUserProvider>
        <NavBar />
      </CurrentUserProvider>
    </Router>
  );

  // Find the profile link by its text content (assumed to be "Profile")
  const profileAvatar = await screen.findByText("Profile");

  // Assert that the profile link is present in the document
  expect(profileAvatar).toBeInTheDocument();
});

/**
 * Test case to verify the behavior of the navigation bar when a user logs out.
 * It checks if Sign In and Sign Up buttons appear after logging out.
 */
test("renders Sign in and Sign up buttons again on log out", async () => {
  // Render NavBar with CurrentUserProvider to simulate a logged-in user context
  render(
    <Router>
      <CurrentUserProvider>
        <NavBar />
      </CurrentUserProvider>
    </Router>
  );

  // Find the 'Sign out' link and simulate a click event to log out
  const signOutLink = await screen.findByRole("link", { name: "Sign out" });
  fireEvent.click(signOutLink);

  // Find the 'Sign in' and 'Sign up' links after logging out
  const signInLink = await screen.findByRole("link", { name: "Sign in" });
  const signUpLink = await screen.findByRole("link", { name: "Sign up" });

  // Assert that both 'Sign in' and 'Sign up' links are visible after logout
  expect(signInLink).toBeInTheDocument();
  expect(signUpLink).toBeInTheDocument();
});
