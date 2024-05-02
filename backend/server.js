const express = require("express");
require("./src/database/connectDb");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const qs = require("qs"); // Import qs module to stringify data for x-www-form-urlencoded format
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Set CORS headers manually
// Add middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, DELETE, POST, PUT"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const adminRoutes = require("./src/routes/admin");
const questRoutes = require("./src/routes/quest");
const twitterAuthentication = require("./src/routes/twitterAuthentication");
app.use(adminRoutes);
app.use(questRoutes);
app.use(twitterAuthentication);

function generateAuthorizationHeader(clientId, clientSecret) {
  // Combine client ID and secret with a colon separator
  const credentials = `${clientId}:${clientSecret}`;

  // Encode the credentials using Base64 encoding
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  // Construct the authorization header string
  return `Basic ${encodedCredentials}`;
}

app.get("/twitter-success/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const grantType = "authorization_code";
    const clientId = "V1FrUFdVZ3picVFSUGtHWExpR1I6MTpjaQ"; // Replace with your client ID
    const redirectUri = "http://localhost:5173/twitter-success"; // Replace with your redirect URI
    const codeVerifier = "abc123ABC"; // Replace with your code verifier (should be the same as used during authorization)

    // Prepare data for the request body
    const requestBody = {
      grant_type: grantType,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      code: code,
    };

    // Exchange authorization code for an access token
    // Make the token request
    const response = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              clientId +
                ":" +
                "DkG8SGDSAtqf9iPJ7k3SBvg2ebMCnSiWZ7jNcyR7zkRt-5OmgT"
            ).toString("base64"), // Include empty secret
        },
      }
    );

    console.log("Access token:", response.data.access_token);

    const accessToken = response.data.access_token;
    // // Now you have the access token!

    // // Use the access token to make authenticated requests to Twitter API
    // // For example, get user data:
    const userResponse = await axios
      .get("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((err) => {
        console.log("error in getting user Data");
        console.log(err);
      });

    // // Now you have the user data!
    console.log(userResponse);
    // // Handle the user data as needed (e.g., store in database, etc.)

    // // Redirect the user to a success page
    res.status(200).json({ user : userResponse });
  } catch (error) {
    console.error("Error exchanging authorization code:", error);
    res.status(500).send("Error exchanging authorization code");
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
