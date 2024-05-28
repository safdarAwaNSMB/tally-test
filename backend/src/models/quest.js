const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  questName: {
    type: String,
    required: true,
  },
  questImage: {
    type: Object,
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
  userTokens:[
    {
      type : String,
    } 
  ],
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
