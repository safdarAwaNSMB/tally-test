const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  questName: {
    type: String,
    required: true,
  },
  questImage: {
    type: String,
    required: true,
  },
  header: {
    type: String,
  },
  description : {
    type : String,
  },
  followLink : {
    type : String,
    required : true
  },
  likeLink : {
    type : String,
    required : true
  },
  retweetLink : {
    type : String,
    required : true
  },
  eventLink : {
    type : String,
    required : true
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
