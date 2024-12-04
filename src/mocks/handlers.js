import { rest } from "msw";

// Base URL for the API
const baseURL = "https://groovemates-backend-b16861eb6026.herokuapp.com/";

// Define the mock API handlers using msw
export const handlers = [
  /**
   * Mock handler for the GET request to fetch the current user data.
   * This will simulate the response as if the user is authenticated and returns user data.
   */
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 2, // Primary key (user ID)
        username: "diya", // Username of the user
        email: "", // Email (not provided in this mock)
        first_name: "", // First name (not provided in this mock)
        last_name: "", // Last name (not provided in this mock)
        profile_id: 2, // Profile ID (user profile identifier)
        profile_image:
          "https://res.cloudinary.com/dwqek0e9x/image/upload/v1/media/../default_profile_twcgma", // URL to the user's profile image
      })
    );
  }),

  /**
   * Mock handler for the POST request to log out the current user.
   * This will simulate a successful logout request.
   */
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200)); // Respond with a 200 status indicating a successful logout
  }),
];
