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


// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
