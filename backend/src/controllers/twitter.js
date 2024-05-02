const crypto = require("crypto"); // Cryptographic library
const Oauth = require("oauth-1.0a"); // OAuth 1.0a library
const qs = require("querystring"); // Query string library
const { URLSearchParams } = require("url"); // URL handling library

// authenticating by twitter

const oauth = Oauth({
  consumer: {
    key: process.env.CONSUMER_KEY,
    secret: process.env.CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});

module.exports.authenticateUser = async (req, res) => {
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
    // Now you have the access token!
    res.status(200).json({ userToken: accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};


module.exports.getUser = async (req, res) => {
  try {
    const { token } = req.params;
    
   const response = await axios.get('https://api.twitter.com/2/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
   })
    
    console.log(response.data);
    // Now you have the access token!
    res.status(200).json({ userData: response.data });
  } catch (error) {
    console.log('error in getting user');
    console.log(error);
    res.status(500).send(error);
  }
};
