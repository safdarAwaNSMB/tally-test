const express = require("express");
require("./src/database/connectDb");
require("dotenv").config();
const cors = require('cors')

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
const  twitterAuthentication = require('./src/routes/twitterAuthentication')
app.use(adminRoutes);
app.use(questRoutes);
app.use(twitterAuthentication);

app.get('/twitter-success', async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange authorization code for an access token
    const response = await axios.post('https://api.twitter.com/oauth/access_token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_CLIENT_SECRET',
        code,
        redirect_uri: 'http://localhost:5173/twitter-success', // Must match the original redirect URI
      },
    });

    const accessToken = response.data.access_token;
    // Now you have the access token!

    // Use the access token to make authenticated requests to Twitter API
    // For example, get user data:
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Now you have the user data!
    console.log(userResponse);
    // Handle the user data as needed (e.g., store in database, etc.)

    // Redirect the user to a success page
    res.status(200).json({token : accessToken, userResponse});
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    res.status(500).send('Error exchanging authorization code');
  }
});




// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
