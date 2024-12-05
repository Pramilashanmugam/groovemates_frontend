import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import SharedPosts from "./pages/shares/SharedPosts";
import NotFound from "./components/NotFound";

/**
 * The main component that sets up routing for the application.
 * It displays the navigation bar and switches between various pages of the app based on the URL.
 * Handles the routing of different pages related to posts, user profiles, and authentication.
 */
function App() {
  const currentUser = useCurrentUser(); // Fetches the current logged-in user's data
  const profile_id = currentUser?.profile_id || ""; // Retrieves the profile ID from the current user context, or sets it to an empty string if not available

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          {/* Routes for PostsPage with different filters based on the page */}
          <Route
            exact
            path="/"
            render={() => (
              <PostsPage message="No results found. Adjust the search keyword." />
            )}
          />
          <Route
            exact
            path="/feed"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            )}
          />
          <Route
            exact
            path="/liked"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or like a post."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            )}
          />
          <Route
            exact
            path="/shared"
            render={() => (
              <SharedPosts
                message="No shared posts found. Share a post to see it here."
                filter={`ordering=-shares__created_at&`}
              />
            )}
          />
          {/* Routes for authentication pages */}
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          {/* Route for creating a post */}
          <Route exact path="/posts/create" render={() => <PostCreateForm />} />
          {/* Routes for individual posts */}
          <Route exact path="/posts/:id" render={() => <PostPage />} />
          <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
          {/* Routes for user profile pages */}
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit/username"
            render={() => <UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            render={() => <UserPasswordForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            render={() => <ProfileEditForm />}
          />
          {/* Default route for page not found */}
          <Route render={() => <NotFound />} />          
        </Switch>
      </Container>
    </div>
  );
}

export default App;
