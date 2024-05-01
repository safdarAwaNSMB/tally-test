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
  console.log("request for twitter authentication");
  try {
    const requestTokenURL = "https://api.twitter.com/oauth/request_token?oauth_callback=http://localhost:5173/collect";
    const authHeader = oauth.toHeader(
      oauth.authorize({
        url: requestTokenURL,
        method: "POST",
      })
    );
    const request = await fetch(requestTokenURL, {
      method: "POST",
      headers: {
        Authorization: authHeader["Authorization"],
      },
    });
    const body = await request.text();
    console.log(body);
    const authorizeURL = `https://api.twitter.com/oauth/authorize?oauth_token=${oAuthRequestToken.oauth_token}`;
    console.log("Please go here and authorize", authorizeURL);
    // return Object.fromEntries(new URLSearchParams(body));
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
