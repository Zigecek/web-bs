/*****************************************************************************
__/\\\\\\\\\\\\\\\__/\\\\\\\\\\\_____/\\\\\\\\\\\\__/\\\\\\\\\\\\\\\_        
 _\////////////\\\__\/////\\\///____/\\\//////////__\/\\\///////////__       
  ___________/\\\/_______\/\\\______/\\\_____________\/\\\_____________      
   _________/\\\/_________\/\\\_____\/\\\____/\\\\\\\_\/\\\\\\\\\\\_____     
    _______/\\\/___________\/\\\_____\/\\\___\/////\\\_\/\\\///////______    
     _____/\\\/_____________\/\\\_____\/\\\_______\/\\\_\/\\\_____________   
      ___/\\\/_______________\/\\\_____\/\\\_______\/\\\_\/\\\_____________  
       __/\\\\\\\\\\\\\\\__/\\\\\\\\\\\_\//\\\\\\\\\\\\/__\/\\\\\\\\\\\\\\\_ 
        _\///////////////__\///////////___\////////////____\///////////////__
*****************************************************************************/

const mongoose = require("mongoose");

const configSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  botAdminDiscordID: {
    deafult: [],
    type: Array,
  },
  ngrokUrl: {
    default: null,
    type: String,
  },
  number: {
    default: 1,
    type: Number,
  },
  PCfeedback: {
    default: 0,
    type: Number,
  },
  pin: {
    default: null,
    type: Number,
  },
  SteambotLogged: {
    default: null,
    type: Boolean,
  },
  SteambotWhoWhenPlaying: {
    default: null,
    type: String,
  },
  ngrokRpiSSH: {
    default: "",
    type: String,
  },
});

module.exports = mongoose.model("Config", configSchema, "config");
