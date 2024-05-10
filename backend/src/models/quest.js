const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  questName: {
    type: String,
    required: true,
  },
  questImage: {
    type: String,
  },
  header: {
    type: String,
  },
  description : {
    type : String,
  },
  followLink : {
    type : String,
  },
  likeLink : {
    type : String,
  },
  retweetLink : {
    type : String,
  },
  eventLink : {
    type : String,
  },
  accessCode : {
    type : String,
    required : true
  },
  creation :{
    type : Date,
    default : new Date()
  }
});
const Quest = mongoose.model("quest", questSchema);
module.exports = Quest;
