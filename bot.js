const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 250000);

global.botVars = {};

var _settings = {moo: {logChannel: "296430168141201410", name: "Lillie", alliance: "Nebula", acceptAll: false, requestTimeout: 300000}};
var editableGlobal = {moo: {partyLink: "52.39.54.145", autoAttack: true}};

var globalChannel = "296429968555114526";
var globalMsgID = "296430530575204352";
var editableGlobalChannel = globalChannel;
var editableGlobalMsgID = "296851264904626176";
var settingsChannel = "292523376352821248";
var settingsMsgID = "296436848388079616";
let bagResponseIDs = ["197592250354499584", "227447542911074304"];
var DEBUG = false;

var leave = true;

//let rainbowRoleGuild = ["284433301945581589", "317083101815898113"];
//let rainbowRole = ["284906292341112832", "317761554789695489"];
let rainbowColors = ["#FF0000", "#FF4400", "#FF8800", "#FFC400", "#FFFF00", "#80FF00", "#00FF00", "#00ff80", "#00FFFF", "#0080FF", "#0000FF", "#8800FF", "#FF00FF", "#FF0080"];
let colorChangeTime = 2500;
let colorIndex = 0;

botVars.reactions = {};

function msToTime(duration) {
  var milliseconds = parseInt((duration%1000)/100), seconds = parseInt((duration/1000)%60), minutes = parseInt((duration/(1000*60))%60), hours = parseInt((duration/(1000*60*60)));
  return hours +  " hours, " + minutes + " minutes, " + seconds + " seconds, " + milliseconds + " milliseconds";
}

var cycleColors = function(){
  if (colorIndex >= rainbowColors.length - 1){
    colorIndex = 0;
  }else{
    colorIndex++;
  }
  //bot.guilds.get(rainbowRoleGuild[0]).roles.get(rainbowRole[0]).setColor(rainbowColors[colorIndex]).catch((err) => {console.log(err);});
  //bot.guilds.get(rainbowRoleGuild[1]).roles.get(rainbowRole[1]).setColor(rainbowColors[colorIndex]).catch((err) => {console.log(err);});
  //bot.guilds.get(rainbowRoleGuild[2]).roles.get(rainbowRole[2]).setColor(rainbowColors[colorIndex]).catch((err) => {console.log(err);});
  bot.guilds.forEach((g) => {
    g.roles.forEach((r) => {
      if (r.name.toLowerCase() === "lillie-rainbow"){
        r.setColor(rainbowColors[colorIndex]).catch((err) => {console.log(err);});
      }
    });
  });
  setTimeout(cycleColors, colorChangeTime);
  return 0;
}

var Discord = require("discord.js");
var bot = new Discord.Client();
botVars.spy = new Discord.Client();
var fs = require('fs');
var readline = require('readline');
const ImagesClient = require('google-images');

botVars.imagesClient = new ImagesClient('004497848346027955910:bvtye9dcwfc', 'AIzaSyApx3SNxIM9N1rALRy6CcbWVLZtzalFW1I');

/*
Nebula's server.id -> 259073919896649728
*/

//Allows for testing new features while bot is running
botVars.botEnable = true;

botVars.regUsers = JSON.parse(fs.readFileSync('./regUsers.json', 'utf8'));
botVars.settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
botVars.permsUsersList = JSON.parse(fs.readFileSync('./permsUsersList.json', 'utf8'));
botVars.userList = JSON.parse(fs.readFileSync('./userList.json', 'utf8'));
let banned = JSON.parse(fs.readFileSync('./banned.json', 'utf8'));//Deprecated
let servers = JSON.parse(fs.readFileSync('./servers.json', 'utf8'));//Deprecated
let tempBanned = JSON.parse(fs.readFileSync('./tempBanned.json', 'utf8'));//Deprecated
botVars.custmsgs = JSON.parse(fs.readFileSync('./custmsgs.json', 'utf8'));
let pointRoles = JSON.parse(fs.readFileSync('./pointRoles.json', 'utf8'));//Deprecated
let questRoles = JSON.parse(fs.readFileSync('./questRoles.json', 'utf8'));//Deprecated
let civilWarRoles = JSON.parse(fs.readFileSync('./civilWarRoles.json', 'utf8'));//Deprecated

bot.on('ready', () => {
  console.log('I am ready!');
  bot.user.setStatus('online');
  bot.user.setGame('Pokémon Moon');
  fs.writeFile('./tempBanned.json', JSON.stringify({}), console.error);
  bot.channels.get(globalChannel).fetchMessage(globalMsgID).then((m) => {_settings = JSON.parse(m.content);});
  bot.channels.get(settingsChannel).fetchMessage(settingsMsgID).then((m) => {botVars.settings = JSON.parse(m.content);});
  bot.channels.get(editableGlobalChannel).fetchMessage(editableGlobalMsgID).then((m) => {editableGlobal = JSON.parse(m.content); autohunt = editableGlobal.moo.autoAttack;});
  cycleColors();
  setTimeout(connect, 2000);
});

bot.on('error', e => {
  if (e);
  console.error(e);
});

bot.on("messageUpdate", (o, n) => {
  if (n.id == globalMsgID){
    _settings = JSON.parse(n.content);
  }
  if (n.id == settingsMsgID){
    botVars.settings = JSON.parse(n.content);
  }
  if (n.id == editableGlobalMsgID){
    editableGlobal = JSON.parse(n.content);
  }
});

bot.on("guildCreate", guild => {
  if (leave){
    bot.channels.get("288573875057590272").send("Auto-left " + guild.name + " (" + guild.id + ")!").then(()=>{guild.leave();});
  }
});

bot.on("guildMemberAdd", (member) => {
  if (banned[member.id] && member.guild.id != "291055526098239489"){
    if (banned[member.id].permban){
      //bot.guilds.get(member.guild.id).members.get(member.id).kick().catch(function(err){bot.channels.get("288573875057590272").send(member + " (" + member.id + ")" + " cannot be kicked from " + member.guild.name + " (" + member.guild.id + ")!"); console.log(err);});
      return;
    }
  }
  bot.user.fetchProfile(member.id).catch(function(err){console.log(err);});
  if (member.guild.id == "284433301945581589"){
    let nickname = member.user.username.toString().replace(/❂/gi, '🌌');
    member.setNickname("🌌 " + nickname).catch((err)=>{console.log(err);});
  }
  bot.users.get(member.id).send("Welcome!");
});

let bagCounter = 0;

var react = function (msg, reactNum){
  if (botVars.reactions[msg.channel.id]){
    if (botVars.reactions[msg.channel.id].reactions){
      msg.react(botVars.reactions[msg.channel.id].reactions[reactNum]).then(() => {
        if (reactNum < botVars.reactions[msg.channel.id].reactions.length){
          setTimeout(react(msg, reactNum + 1), 500);
        }
      });
    }
  }
}

bot.on("message", msg => {
  react(msg, 0);
  if (msg.channel.type == 'dm' && !msg.author.bot && msg.author.id != "197592250354499584"){
    bot.users.get("197592250354499584").send(msg.author.id + " " + msg.content);
  }
  if (msg.content.toLowerCase().includes("gender")){
     msg.channel.send("TRIGGERED!");
  }
  // [F] MAKE THIS PER-SERVER!!!
  // if ((msg.content.length < botVars.settings["minmsglength"].value) && (!msg.author.bot)){
  //   msg.delete(botVars.settings["minmsgdeletetime"].value);
  // }
  if (bagResponseIDs.indexOf(msg.author.id) > -1 && (msg.content.toLowerCase().includes("pew"))){
    msg.channel.send("**" + msg.author + ", GET IN THE BAG!!!**").then((sent) => {
      //sent.delete(15000);
    });
    bagCounter++;
    if (bagCounter == 10){
      bagCounter = 0;
      msg.channel.send("https://68.media.tumblr.com/6911d9496f3f5d94c69036528aecef5c/tumblr_ohdc2zs11Y1qlrztvo1_500.png").then ((sent2) => {
        //sent2.delete(15000);
      });
    }
  }
  if (botVars.custmsgs[msg.author.id]){
    if (botVars.custmsgs[msg.author.id].toggle == true){
      msg.channel.send(bot.users.get(msg.author.id) + ", " + botVars.custmsgs[msg.author.id].text).then((sent) => {
        sent.delete(15000);
      });
    }
  }
  if (msg.channel && msg.channel.name && msg.channel.name == 'lillie-echo'){
	if (!msg.guild){
		return;
	}
	if (msg.webhookID){
		return;
	}
	if (msg.channel.permissionsFor(bot.user).has('MANAGE_WEBHOOKS')){
		msg.channel.fetchWebhooks().then((webhooks) => {
			if (webhooks.filter(w => w.owner == bot.user).array().length > 0){
				let w = webhooks.filter(w => w.owner == bot.user).first();
				let content = '';
				let echo = {
					username: msg.guild.member(msg.author).displayName,
					avatarURL: (msg.author.avatar ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png?size=256` : "http://i.imgur.com/hQJTVfD.png"),
					disableEveryone: true
				};
				if (msg.content){
					content = msg.cleanContent;
				}
				let attachmentsArray = msg.attachments.array();
					let attachmentsLength = attachmentsArray.length;
					if (attachmentsLength > 0){
						echo.files = [];
						attachmentsArray.forEach((a) => {
							echo.files.push(a.url);
						});
					}
				if (msg.embeds.length > 0){
					echo.embeds = [];
					echo.embeds[0] = {};
					Object.keys(msg.embeds[0]).forEach((k) => {
						if (
							k == 'author' ||
							k == 'color' ||
							k == 'description' ||
							k == 'fields' ||
							k == 'footer' ||
							k == 'image' ||
							k == 'thumbnail' ||
							k == 'title' ||
							k == 'url'
						){
							echo.embeds[0][k] = msg.embeds[0][k];
						}
					});
				}
				w.send(content, echo);
			}else{
				msg.channel.createWebhook('Lillie Echo', 'https://miketendo64.files.wordpress.com/2016/06/1a.png?w=657&h=657').then((w) => {
					w.edit('Lillie Echo', 'https://miketendo64.files.wordpress.com/2016/06/1a.png?w=657&h=657');
					msg.channel.send('Webhook set up successfully! Echo is now ready to go!');
				}).catch((err) => {
					msg.channel.send('Webhook Creation Error!');
				});
			}
		});
	}
}
  let prefix = botVars.settings["prefix"].value;
  let commandUsed = false;
  let command =  ((msg.content.split(" "))[0]).replace(prefix, '');
  let args = msg.content.split(" ").slice(1);
  if (!msg.content.startsWith(prefix)) return;
  if (msg.author.bot) return;
  /*Perms:
  0: Everyone
  1: Mods
  2: Admins
  3: Whitelisted group
  4: Owner

exports.exec = (bot, msg, args) => {
  return new Promise((resolve, reject) => {

  });
};

exports.permsRequired = 0;
  }*/
  if (botVars.botEnable == true){

  if (command == "autoreactadd" || command == "ara") {
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    let all = false;
    if (args[0] == "-s"){
      all = true;
      args = args.slice(1);
    }
    let reactionArray = [];
    args.forEach((arg) => {reactionArray.push(arg);});
    if (all){
      let array = [];
      msg.guild.channels.forEach((channel) => {array.push(channel.id);});
      if (!botVars.reactions[msg.channel.id]){
        for (let i = 0; i < array.length; i++){
          botVars.reactions[array[i.toString()]] = {reactions: reactionArray};
        }
        msg.channel.send("Auto-react enabled! (for all channels in this server)");
      }else{
        for (let i = 0; i < array.length; i++){
          botVars.reactions[array[i.toString()]].reactions = reactionArray;
        }
        msg.channel.send("Auto-react updated! (for all channels in this server)");
      }
      return;
    }
    if (!botVars.reactions[msg.channel.id]){
      botVars.reactions[msg.channel.id] = {reactions: reactionArray};
      msg.channel.send("Auto-react enabled!");
    }else{
      mentionResponses[msg.channel.id].reactions = reactionArray;
      msg.channel.send("Auto-react updated!");
    }
  }

  else if (command == "autoreactdelete" || command == "ard") {
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (args[0] == "-g"){
      if (msg.author.id != "197592250354499584"){
        msg.channel.send("Insufficient permissions!");
        return;
      }
      botVars.reactions = {};
      msg.channel.send("Deleted all auto-reactions globally!");
      return;
    }
    if (args[0] == "-s"){
      let array = [];
      msg.guild.channels.forEach((channel) => {array.push(channel.id);});
      array.forEach((a) => {
        if (botVars.reactions[a]){
          delete botVars.reactions[a];
        }
      });
      msg.channel.send("Deleted all auto-reactions on this server!");
      return;
    }
    if (!botVars.reactions[msg.channel.id]){
      msg.channel.send("There are no auto-reactions in this channel!");
    }else{
      delete botVars.reactions[msg.channel.id];
      msg.channel.send("Deleted auto-reactions for this channel!");
    }
  }

  else if (command == "skroles"){
    if (!msg.mentions.users.first()){
      msg.channel.send("Mention required!");
      return;
    }
    if (!botVars.spy.guilds.get("252525368865456130").member(msg.mentions.users.first())){
      msg.channel.send(msg.mentions.users.first() + "is not in SK!");
      return;
    }
    let a = [];
    botVars.spy.guilds.get("252525368865456130").member(msg.mentions.users.first()).roles.forEach((r)=>{
      a.push(r.name);
    });
    msg.channel.send("\`\`\`\n" + a.join("\n") + "\n\`\`\`");
    commandUsed = true;
  }

  else if (command == "skcount"){
    if (!msg.guild) return;
    let inclBots = false;
    if (args[0] == "-incl-bots"){
      inclBots = true;
    }
    let origin = msg.guild;
    let target = botVars.spy.guilds.get("252525368865456130");
    let numShared = 0;
    let memberCount = origin.memberCount;
    origin.members.forEach((m)=>{
      if (target.members.get(m.id)){
        if (inclBots == false && !m.user.bot){
          numShared++;
        }
        if (inclBots == false && m.user.bot){
          memberCount--;
        }
        if (inclBots == true){
          numShared++;
        }
      }
    });
    msg.channel.send(numShared + " members are in SK! (" + (numShared * 100 / memberCount) + "%)");
  }

  else if (command == "nebulayt"){
    msg.channel.send("Our Nebula YouTube channel is at https://www.youtube.com/channel/UCqcYh-KDSjw4Jwodx7A8rmw. Subscribe!");
    commandUsed == true;
  }

  else if (command == "sk?"){
    let user = msg.mentions.users.first();
    if (!user){
    	msg.channel.send("Please specify a user!");
	return;
    }
    let origin = msg.guild;
    let target = botVars.spy.guilds.get("252525368865456130");
    if (target.members.get(user.id)){
      msg.channel.send(user + " is in SK!");
    }else{
      msg.channel.send(user + " is not in SK!");
    }
}

  //Private DM

  else if (command == "_dm"){
    if (!args[0]){
      msg.channel.send("`Usage: [p]_dm [userid] [message]`");
      return;
    }
    if (isNaN(args[0])){
      msg.channel.send("`Usage: [p]_dm [userid] [message]`");
      return;
    }
    if (!bot.user.fetchProfile(args[0].toString())){
      msg.channel.send("`Usage: [p]_dm [userid] [message]`");
      return;
    }
    bot.users.get(args[0].toString()).send(args.slice(1).join(" ").toString());
    msg.channel.send("Message sent successfully!");
  }

  //Fun

  else if (command == "trump"){
    if (!args[0]){
        msg.channel.send("WE MUST BUILD A WALL!");
    }
    if (args[0]){
      msg.channel.send("Make " + args.toString().replace(/,/g, ' ') + " great again!");
    }
    commandUsed = true;
  }

  else if (command == "trumpmeme"){
    botVars.imagesClient.search('trump meme ' + (Math.floor(Math.random() * (10) )).toString())
      .then(function (images) {
         let array = images.slice(0,9);
         let n = Math.floor(Math.random() * (10) );
         for (let i = 0; i < 10; i++){
            while (!array[n]){
             n = Math.floor(Math.random() * (10) );
            }
         }
         if (!array[n]){
           msg.channel.send("Error! Please try again!");
           return;
         }
         msg.channel.send(array[n].url).then((sent) => {
           if (botVars.botVars.settings["tempmemes"].value == true){
             msg.delete(botVars.settings["tempmemestime"].value);
             sent.delete(botVars.settings["tempmemestime"].value);
           }
         });
    });
    commandUsed = true;
  }

  else if (command == "christmas"){
    botVars.imagesClient.search('house with christmas lights tree OR christmas tree ' + (Math.floor(Math.random() * (10) )).toString())
      .then(function (images) {
         let array = images.slice(0,9);
         let n = Math.floor(Math.random() * (10) );
         for (let i = 0; i < 10; i++){
            while (!array[n]){
             n = Math.floor(Math.random() * (10) );
            }
         }
         if (!array[n]){
           msg.channel.send("Error! Please try again!");
           return;
         }
         msg.channel.send(array[n].url).then((sent) => {
           if (botVars.settings["tempmemes"].value == true){
             msg.delete(botVars.settings["tempmemestime"].value);
             sent.delete(botVars.settings["tempmemestime"].value);
           }
         });
    });
    commandUsed = true;
  }

  else if (command == "kittens"){
    botVars.imagesClient.search('cute kittens ' + (Math.floor(Math.random() * (10) )).toString())
      .then(function (images) {
         let array = images.slice(0,9);
         let n = Math.floor(Math.random() * (10) );
         for (let i = 0; i < 10; i++){
            while (!array[n]){
             n = Math.floor(Math.random() * (10) );
            }
         }
         if (!array[n]){
           msg.channel.send("Error! Please try again!");
           return;
         }
         msg.channel.send(array[n].url).then((sent) => {
           if (botVars.settings["tempmemes"].value == true){
             msg.delete(botVars.settings["tempmemestime"].value);
             sent.delete(botVars.settings["tempmemestime"].value);
           }
         });
    });
    commandUsed = true;
  }

  //botVars.settings
  else if (command == "selfpts"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        botVars.settings["selfpts"].value = false;
        msg.channel.send("Disabled selfpoints!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        botVars.settings["selfpts"].value = true;
        msg.channel.send("Enabled selfpoints!");
      }else{
        msg.channel.send("`Usage: [p]selfpts [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "deletebannedmsgs"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        botVars.settings["deletebannedmsgs"].value = false;
        msg.channel.send("Disabled banned message deletion!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        botVars.settings["deletebannedmsgs"].value = true;
        msg.channel.send("Enabled banned message deletion!");
      }else{
        msg.channel.send("`Usage: [p]deletebannedmsgs [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "setprefix"){
    if (msg.author.id == "197592250354499584"){
      if (!args[0]){
        msg.channel.send("`Usage: [p]prefix [prefix]`");
        return;
      }
      botVars.settings["prefix"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
      msg.channel.send("Prefix set to " + botVars.settings["prefix"].value + "!");
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "tempmemes"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        botVars.settings["tempmemes"].value = false;
        msg.channel.send("Disabled temporary memes!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        botVars.settings["tempmemes"].value = true;
        msg.channel.send("Enabled temporary memes!");
      }else{
        msg.channel.send("`Usage: [p]tempmemes [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "tempmemestime"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.send(botVars.settings["tempmemestime"].value + "ms");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.send(botVars.settings["tempmemestime"].value + "ms");
        return;
      }
      botVars.settings["tempmemestime"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
      msg.channel.send("Temporary meme time set to " + botVars.settings["tempmemestime"].value + " milliseconds!");
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "minmsgdeletetime"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.send(botVars.settings["minmsgdeletetime"].value + "ms");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.send(botVars.settings["minmsgdeletetime"].value + "ms");
        return;
      }
      botVars.settings["minmsgdeletetime"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
      msg.channel.send("Minimum limit deletion time set to " + botVars.settings["minmsgdeletetime"].value + " milliseconds!");
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "deletebannedmsgstime"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.send(botVars.settings["deletebannedmsgstime"].value + "ms");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.send(botVars.settings["deletebannedmsgstime"].value + "ms");
        return;
      }
      botVars.settings["deletebannedmsgstime"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
      msg.channel.send("Banned message deletion time set to " + botVars.settings["deletebannedmsgstime"].value + " milliseconds!");
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "minmsglength"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (!args){
        msg.channel.send(botVars.settings["minmsglength"].value + " characters");
        return;
      }
      if (isNaN(args[0])){
        msg.channel.send(botVars.settings["minmsglength"].value + " characters");
        return;
      }
      botVars.settings["minmsglength"].value = args[0];
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
      msg.channel.send("Minimum message length set to " + botVars.settings["minmsglength"].value + " characters!");
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  /*LEGACY -- USE CUSTMSG INSTEAD!
  else if (command == "shippingmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        botVars.settings["shippingmsg"].value = false;
        msg.channel.send("Disabled shipping warning!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        botVars.settings["shippingmsg"].value = true;
        msg.channel.send("Enabled shipping warning!");
      }else{
        msg.channel.send("`Usage: [p]shippingmsg [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "nokissingmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        botVars.settings["nokissingmsg"].value = false;
        msg.channel.send("Disabled kissing warning!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        botVars.settings["nokissingmsg"].value = true;
        msg.channel.send("Enabled kissing warning!");
      }else{
        msg.channel.send("`Usage: [p]nokissingmsg [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }
  */

  else if (command == "custmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (!msg.mentions.users.first()){
        msg.channel.send("`Usage: [p]custmsg [enable/disable] @mention`");
        return;
      }
      if (!botVars.custmsgs[msg.mentions.users.first().id]){
        msg.channel.send("User does not have a custom message!");
        return;
      }
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        botVars.custmsgs[msg.mentions.users.first().id].toggle = false;
        msg.channel.send("Disabled custom message for " + msg.mentions.users.first() + "!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        botVars.custmsgs[msg.mentions.users.first().id].toggle = true;
        msg.channel.send("Enabled custom message for " + msg.mentions.users.first() + "!");
      }else{
        msg.channel.send("`Usage: [p]custmsg [enable/disable] @mention`");
        return;
      }
      fs.writeFile('./custmsgs.json', JSON.stringify(botVars.custmsgs), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "showcustmsg"){
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]showcustmsg @mention`");
      return;
    }
    if (!botVars.custmsgs[msg.mentions.users.first().id]){
      msg.channel.send("User does not have a custom message!");
      return;
    }
    msg.channel.send(bot.users.get(msg.mentions.users.first().id) + "'s custom message is: " + bot.users.get(msg.mentions.users.first().id) + ", " + botVars.custmsgs[msg.mentions.users.first().id].text + '\n' + "Message toggle is currently " + botVars.custmsgs[msg.mentions.users.first().id].toggle + "!");
    commandUsed = true;
  }

  else if (command == "addcustmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (!args[0]){
        msg.channel.send("`Usage: [p]addcustmsg [userid or @mention] [custom message]`");
        return;
      }
      if (msg.mentions.users.first()){
        let text = args.slice(1).toString().replace(/,/g, ' ');
        if (!botVars.custmsgs[msg.mentions.users.first().id]){
          botVars.custmsgs[msg.mentions.users.first().id] = {text: text, toggle: true};
          msg.channel.send("Message for " + bot.users.get(msg.mentions.users.first().id) + " set to: " + bot.users.get(msg.mentions.users.first().id) + ", " + text);
        }else{
          botVars.custmsgs[msg.mentions.users.first().id].text = text;
          msg.channel.send("Message for " + bot.users.get(msg.mentions.users.first().id) + " set to: " + bot.users.get(msg.mentions.users.first().id) + ", " +text + '\n' + "Message toggle is currently " + botVars.custmsgs[msg.mentions.users.first().id].toggle + "!");
        }
      }else if (!isNaN(args[0])){
        let text = args.slice(1).toString().replace(/,/g, ' ');
        if (!botVars.custmsgs[args[0]]){
          botVars.custmsgs[args[0]] = {text: text, toggle: true};
          msg.channel.send("Message for " + bot.users.get(args[0]) + " set to: " + bot.users.get(args[0]) + ", " + text);
        }else{
          botVars.custmsgs[args[0]].text = text;
          msg.channel.send("Message for " + bot.users.get(args[0]) + " set to: " + bot.users.get(args[0]) + ", " + text + '\n' + "Message toggle is currently " + botVars.custmsgs[args[0]].toggle + "!");
        }
      }else{
        msg.channel.send("`Usage: [p]addcustmsg [userid] [custom message]`");
        return;
      }
      fs.writeFile('./custmsgs.json', JSON.stringify(botVars.custmsgs), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "delcustmsg"){
    if ((msg.author.id == "197592250354499584") || (msg.author.id == "223811504833691648")){
      if (!args[0]){
        msg.channel.send("`Usage: [p]delcustmsg [userid or @mention]`");
        return;
      }
      let targetUser;
      if (!isNaN(args[0])){
        targetUser = args[0];
        delete botVars.custmsgs[targetUser];
      }else if (msg.mentions.users.first()){
        targetUser = msg.mentions.users.first().id;
        delete botVars.custmsgs[targetUser];
      }else{
        msg.channel.send("`Usage: [p]delcustmsg [userid or @mention]`");
        return;
      }
      fs.writeFile('./custmsgs.json', JSON.stringify(botVars.custmsgs), console.error);
      msg.channel.send("Custom message for " + bot.users.get(targetUser) + " successfully deleted!");
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "latency"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      if (args[0] == "false" || args[0] == "no" || args[0] == "disable" || args[0] == "off"){
        botVars.settings["latency"].value = false;
        msg.channel.send("Disabled latency!");
      }else if (args[0] == "true" || args[0] == "yes" || args[0] == "enable" || args[0] == "on"){
        botVars.settings["latency"].value = true;
        msg.channel.send("Enabled latency!");
      }else{
        msg.channel.send("`Usage: [p]latency [enable/disable]`");
        return;
      }
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "setgame"){
    if (msg.author.id != "197592250354499584"){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    let game = args.toString().replace(/,/g, ' ');
    bot.user.setGame(game);
    commandUsed = true;
  }

  else if (command == "thereisabug"){
    if(!args[0]){
      msg.channel.send("`Usage: [p]thereisabug [Description of bug...]`");
      return;
    }
    let text = "There is a bug!"
    let sender = msg.author.username;
    text = args.toString().replace(/,/g, ' ');
    bot.users.get("197592250354499584").send(bot.users.get("197592250354499584") + " There is a bug! " + text + " Reported by: " + sender + "!");
    msg.channel.send("Your bug report has been sent!");
    commandUsed = true;
  }

  else if (command == "suggestion"){
    if(!args[0]){
      msg.channel.send("`Usage: [p]suggestion [Description]`");
      return;
    }
    let text = "Suggestion!"
    let sender = msg.author.username;
    text = args.toString().replace(/,/g, ' ');
    bot.users.get("197592250354499584").send(bot.users.get("197592250354499584") + " Suggestion: " + text + " By: " + sender + "!");
    msg.channel.send("Your suggestion has been sent!");
    commandUsed = true;
  }

  else if (command == "serverreg"){
    let i = 0;
    while (servers[i.toString()]){
      if (servers[i].id == msg.guild.id){
        msg.channel.send("Server is already registered!");
        return;
      }
      i++;
    }
    servers[i] = {"name": msg.guild.name, "id": msg.guild.id};
    botVars.settings["numServers"].value++;
    fs.writeFile('./servers.json', JSON.stringify(servers), console.error);
    fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
    msg.channel.send("Server is now registered!");
  }

  else if (command == "prune"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (!args[0]){
      msg.channel.send("`Usage: [p]prune [number]`");
      return;
    }
    if (isNaN(parseInt(args[0]))){
      msg.channel.send("`Usage: [p]prune [number]`");
      return;
    }
    let msgOnce = false;
    if (args[0] > 99){
      let numMsgs = parseInt(args[0]) + 1;
      while (numMsgs > 0){
        if (numMsgs > 99){
          msg.channel.bulkDelete(100).then(()=>{
            if (numMsgs == 0){
              if (!msgOnce){
                msg.channel.send("Pruned " + args[0] + " messages successfully!");
              }
              msgOnce = true;
            }
          });;
          numMsgs -= 100;
        }else{
          msg.channel.bulkDelete(numMsgs).then(()=>{
            if (numMsgs == 0 && !msgOnce){
              msg.channel.send(`Pruned ${args[0]} messages successfully!`);
            }
          });
          numMsgs -= numMsgs;
        }
      }
    }else{
      msg.channel.bulkDelete(parseInt(args[0]) + 1).then(()=>{
        if (!msgOnce){
         msg.channel.send(`Pruned ${args[0]} messages successfully!`);
        }
      });
    }
  }
  //Bans

  else if (command == "timeban"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isMod != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]timeban [@mention]`");
      return;
    }
    if(!banned[targetUser.id]){
      banned[targetUser.id] = {timeban: true, permban: false};
    }else{
      banned[targetUser.id].timeban = true;
    }
    fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
    msg.channel.send(targetUser + " has been time banned! Messages will be deleted after " + botVars.settings["deletebannedmsgstime"].value + "ms!");
    commandUsed = true;
  }

  else if (command == "untimeban"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isMod != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]untimeban [@mention]`");
      return;
    }
    if (!banned[targetUser.id]){
      msg.channel.send(targetUser + " does not currently have a ban!");
      return;
    }
    if(banned[targetUser.id]){
      if (!banned[targetUser.id].timeban){
        msg.channel.send(targetUser + " does not currently have a time ban!");
        return;
      }
      banned[targetUser.id].timeban = false;
      if (banned[targetUser.id].timeban == false && banned[targetUser.id].permban == false){
        delete banned[targetUser.id];
      }
      fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
      msg.channel.send(targetUser + " is no longer time banned!");
    }
    commandUsed = true;
  }

  else if (command == "permban"){
    if (msg.author.id != "197592250354499584" && (msg.author.id != "223811504833691648")){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first() && isNaN(args[0])){
      msg.channel.send("`Usage: [p]permban [@mention or user ID]`");
      return;
    }
    let targetUser;
    if (!isNaN(args[0])){
      targetUser = args[0];
    }
    if (msg.mentions.users.first()){
      targetUser = msg.mentions.users.first().id;
    }
    if (targetUser == "197592250354499584" || (targetUser == "223811504833691648")){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    bot.user.fetchProfile(targetUser);
    if(!banned[targetUser]){
      if (targetUser){
        banned[targetUser] = {timeban: false, permban: true};
      }else{
        banned[args[0]] = {timeban: false, permban: true};
      }
    }else{
      if (targetUser){
        banned[targetUser].permban = true;
      }else{
        banned[args[0]].permban = true;
      }
    }
    fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
    msg.channel.send(targetUser + " has been permanently banned!");
    let serverid = 0;
    let servername = "";
    let allServers = [];
    bot.guilds.forEach((guild) => {allServers.push(guild);});
    for (let i = 0; i < allServers.length; i++){
      let xx = i.toString();
      if (bot.guilds.get(allServers[xx].id)){
      if (bot.guilds.get(allServers[xx].id).members.get(targetUser.toString())){
        serverid = servers[xx].id;
        servername = servers[xx].name;
        if (!bot.guilds.get(serverid).members.get(bot.user.id).hasPermission("KICK_MEMBERS")){
          msg.channel.send(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " cannot be kicked from " + servername + " (" + serverid + ")!");
          continue;
        }
        bot.guilds.get(serverid).members.get(targetUser.toString()).kick().catch(function(err){console.log(err);});
        msg.channel.send(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " has been kicked from " + servername + " (" + serverid + ")!");
      }
    }
    }
    commandUsed = true;
  }

  else if (command == "unpermban"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (msg.author.id != "197592250354499584"){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    let targetUser = args[0];
    if (isNaN(targetUser)){
      msg.channel.send("`Usage: [p]permban [userid]`");
      return;
    }
    if (!banned[targetUser]){
      msg.channel.send(targetUser + " does not currently have a ban!");
      return;
    }
    if(banned[targetUser]){
      if (!banned[targetUser].permban){
        msg.channel.send(targetUser + " does not currently have a permanent ban!");
        return;
      }
      banned[targetUser].permban = false;
      if (banned[targetUser].timeban == false && banned[targetUser].permban == false){
        delete banned[targetUser];
      }
      fs.writeFile('./banned.json', JSON.stringify(banned), console.error);
      msg.channel.send(targetUser + " is no longer permanently banned!");
    }
    commandUsed = true;
  }

  else if (command == "tempban"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isMod != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]tempban [ms] @mention`");
      return;
    }
    if (isNaN(args[0])){
      msg.channel.send("`Usage: [p]tempban [ms] @mention`");
      return;
    }
    if(!tempBanned[targetUser.id]){
      tempBanned[targetUser.id] = {tempban: args[0]};
    }else{
      tempBanned[targetUser.id].tempban = args[0];
    }
    setTimeout(function(){
      if (tempBanned[targetUser.id]){
        delete tempBanned[targetUser.id];
        fs.writeFile('./tempBanned.json', JSON.stringify(tempBanned), console.error);
      }
    }, args[0]);
    fs.writeFile('./tempBanned.json', JSON.stringify(tempBanned), console.error);
    msg.channel.send(targetUser + " has been temporarily banned for " + args[0] + "ms!");
    commandUsed = true;
  }

  else if (command == "untempban"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isMod != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    let targetUser = msg.mentions.users.first();
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]tempban @mention`");
      return;
    }
    if (!tempBanned[targetUser.id]){
      msg.channel.send(targetUser + " does not currently have a temporary ban!");
      return;
    }
    if(tempBanned[targetUser.id]){
      if (!tempBanned[targetUser.id].tempban){
        msg.channel.send(targetUser + " does not currently have a temporary ban!");
        return;
      }
      delete tempBanned[targetUser.id];
      fs.writeFile('./tempBanned.json', JSON.stringify(tempBanned), console.error);
      msg.channel.send(targetUser + " is no longer temporarily banned!");
    }
    commandUsed = true;
  }

  //Bot perms

  else if (command == "addptsmod"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]addptsmod @mention`");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      let targetUser = msg.mentions.users.first();
      if (!botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')] = {isAdmin: false, isMod: true};
        fs.writeFile('./permsUsersList.json', JSON.stringify(botVars.permsUsersList), console.error);
        msg.channel.send(targetUser + " can now access bot mod commands!");
      }else if (botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod == true){
        msg.channel.send(targetUser + " already has access to bot mod commands!");
      }else{
        botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod = true;
        fs.writeFile('./permsUsersList.json', JSON.stringify(botVars.permsUsersList), console.error);
        msg.channel.send(targetUser + " can now access bot mod commands!");
      }
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "delptsmod"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]delptsmod @mention`");
      return;
    }
    if ((msg.author.id == "197592250354499584") || (botVars.permsUsersList[msg.author.id].isAdmin == true)){
      let targetUser = msg.mentions.users.first();
      if (!botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        msg.channel.send(targetUser + " does not have bot mod command access!");
      }else if (botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin == true){
        msg.channel.send(targetUser + " is a bot admin!");
      }else if (botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod == true){
        delete botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]
        msg.channel.send(targetUser + " no longer has access to bot mod commands!");
      }else{
        msg.channel.send("Error!");
      }
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "addptsadmin"){
    if (msg.author.id == "197592250354499584"){
      let targetUser = msg.mentions.users.first();
      if (!msg.mentions.users.first()){
        msg.channel.send("`Usage: [p]addptsadmin @mention`");
        return;
      }
      if (!botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')] = {isAdmin: true, isMod: true};
        fs.writeFile('./permsUsersList.json', JSON.stringify(botVars.permsUsersList), console.error);
        msg.channel.send(targetUser + " can now access bot admin commands!");
      }else if (botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin == true){
        msg.channel.send(targetUser + " already has access to bot admin commands!");
      }else{
        botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin = true;
        botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isMod = true;
        fs.writeFile('./permsUsersList.json', JSON.stringify(botVars.permsUsersList), console.error);
        msg.channel.send(targetUser + " can now access bot admin commands!");
      }
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  else if (command == "delptsadmin"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]delptsmod @mention`");
      return;
    }
    if (msg.author.id == "197592250354499584"){
      let targetUser = msg.mentions.users.first();
      if (!botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')]){
        msg.channel.send(targetUser + " does not have bot admin command access!");
      }
      else if (botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin == true){
        botVars.permsUsersList[targetUser.toString().replace('<', '').replace('@', '').replace('>', '')].isAdmin = false;
        msg.channel.send(targetUser + " no longer has access to bot mod commands! Bot mod access is still retained!");
      }else{
        msg.channel.send("Error!");
      }
    }else{
      msg.channel.send("Insufficient permissions!");
    }
    commandUsed = true;
  }

  //Points stuff

  else if (command == "ptsreg"){
    let targetUser = msg.mentions.users.first().id;
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]ptsreg @mention`");
      return;
    }
    let i = 0;
    if(!botVars.regUsers[targetUser]){
      botVars.regUsers[targetUser] = {points: 0, quests: 0, civilWars: 0, banStatus: false};
      fs.writeFile('./regUsers.json', JSON.stringify(botVars.regUsers), console.error);
      while (botVars.userList[i.toString()]){
        i++;
      }
      botVars.userList[i.toString()] = targetUser;
      botVars.settings["numUsers"].value = i + 1;
      fs.writeFile('./userList.json', JSON.stringify(botVars.userList), console.error);
      fs.writeFile('./settings.json', JSON.stringify(botVars.settings), console.error);
      msg.channel.send(bot.users.get(targetUser) + " has been registered to the quest system!");
    }else{
      msg.channel.send(bot.users.get(targetUser) + " is already registered to the quest system!");
    }
    commandUsed = true;
  }

  else if (command == "ptscalc"){
    if (isNaN(args[0])){
      msg.channel.send("`Usage: [p]ptscalc score`");
      return;
    }
    if (args[0] < 50000){
      msg.channel.send(args[0] + " diep.io score is " + 0 + " points!");
      return;
    }
    msg.channel.send(args[0] + " diep.io score is " + Math.ceil(Math.pow(args[0], 1.1) / 100000) + " points!");
    commandUsed = true;
  }

  else if (command == "ptsadd"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    if (botVars.permsUsersList[msg.author.id].isMod == true){
      let targetUser = msg.mentions.users.first().id;
      if (!msg.mentions.users.first()){
        msg.channel.send("`Usage: [p]ptsadd [number] @mention`");
        return;
      }
      if ((botVars.settings["selfpts"].toggle == false) && (targetUser == msg.author.id)){
        msg.channel.send("Self points are currently disabled!");
        return;
      }
      let points = parseFloat(args[0]);
      if (isNaN(points)){
        msg.channel.send("Error! Make sure first argument is point value!");
        return;
      }
      if (!botVars.regUsers[targetUser]){
        msg.channel.send("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
      }else{
        let currentPoints = parseFloat(botVars.regUsers[targetUser].points.toString());
        currentPoints += points;
        botVars.regUsers[targetUser.toString()].points = currentPoints;
        fs.writeFile('./regUsers.json', JSON.stringify(botVars.regUsers), console.error);
        msg.channel.send(bot.users.get(targetUser) + " gained " + points + " points! " + "Total: " + currentPoints + " points!");
        let rolesToAdd = [];
        let rolesToDelete = [];
        if (!pointRoles[msg.guild.id]){
          return;
        }
        bot.guilds.get(msg.guild.id).fetchMember(targetUser);
        let roleTarget = msg.guild.members.get(msg.mentions.users.first().id);
        for (let i = 0; pointRoles[msg.guild.id][i.toString()]; i++){
          if (pointRoles[msg.guild.id][i.toString()]){
            if (!roleTarget.roles.has(pointRoles[msg.guild.id][i.toString()].roleid)){
              if (botVars.regUsers[targetUser].points >= pointRoles[msg.guild.id][i.toString()].points){
                rolesToAdd.push(msg.guild.roles.get(pointRoles[msg.guild.id][i.toString()].roleid.toString()));
              }
              if (botVars.regUsers[targetUser].points < pointRoles[msg.guild.id][i.toString()].points){
                rolesToDelete.push(pointRoles[msg.guild.id][i.toString()].roleid.toString());
              }
            }
          }
        }
        setTimeout(function(){msg.guild.members.get(targetUser).addRoles(rolesToAdd);}, 250);
        setTimeout(function(){msg.guild.members.get(targetUser).removeRoles(rolesToDelete);}, 250);
        _rolesToAdd = rolesToAdd;
        _rolesToDelete = rolesToDelete;
        while (_rolesToAdd[0]){
          //roleTarget.addRole(rolesToAdd[0]);
          msg.channel.send("Added role " + _rolesToAdd[0] + " to " + bot.users.get(targetUser) + "!");
          _rolesToAdd = _rolesToAdd.slice(1);
        }
        while (_rolesToDelete[0]){
          //roleTarget.removeRole(rolesToDelete[0]);
          msg.channel.send("Deleted role " + _rolesToDelete[0] + " from " + bot.users.get(targetUser) + "!");
          _rolesToDelete = _rolesToDelete.slice(1);
        }
        }
      }else{
        msg.channel.send("Insufficient Permissions!");
      }
      commandUsed = true;
  }

  else if (command == "questsadd"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    if (botVars.permsUsersList[msg.author.id].isMod == true){
      let targetUser = msg.mentions.users.first().id;
      if (!msg.mentions.users.first()){
        msg.channel.send("`Usage: [p]questsadd [number] @mention`");
        return;
      }
      if ((botVars.settings["selfpts"].toggle == false) && (targetUser == msg.author.id)){
        msg.channel.send("Self points are currently disabled!");
        return;
      }
      let quests = parseFloat(args[0]);
      if (isNaN(quests)){
        msg.channel.send("Error! Make sure first argument is quest value!");
        return;
      }
      if (!botVars.regUsers[targetUser]){
        msg.channel.send("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
      }else{
        let currentQuests = parseFloat(botVars.regUsers[targetUser].quests.toString());
        currentQuests += quests;
        botVars.regUsers[targetUser].quests = currentQuests;
        fs.writeFile('./regUsers.json', JSON.stringify(botVars.regUsers), console.error);
        msg.channel.send(bot.users.get(targetUser) + " gained " + quests + " quests! " + "Total: " + currentQuests + " quests!");
        }
      }else{
        msg.channel.send("Insufficient Permissions!");
      }
      commandUsed = true;
  }

  else if (command == "civilwarsadd"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    if (botVars.permsUsersList[msg.author.id].isMod == true){
      let targetUser = msg.mentions.users.first().id;
      if (!msg.mentions.users.first()){
        msg.channel.send("`Usage: [p]civilwarsadd [number] @mention`");
        return;
      }
      if ((botVars.settings["selfpts"].toggle == false) && (targetUser == msg.author.id)){
        msg.channel.send("Self points are currently disabled!");
        return;
      }
      let civilWars = parseFloat(args[0]);
      if (isNaN(civilWars)){
        msg.channel.send("Error! Make sure first argument is civil war value!");
        return;
      }
      if (!botVars.regUsers[targetUser]){
        msg.channel.send("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
      }else{
        let currentCivilWars = parseFloat(botVars.regUsers[targetUser].civilWars.toString());
        currentCivilWars += civilWars;
        botVars.regUsers[targetUser].civilWars = currentCivilWars;
        fs.writeFile('./regUsers.json', JSON.stringify(botVars.regUsers), console.error);
        msg.channel.send(bot.users.get(targetUser) + " gained " + civilWars + " civil wars! " + "Total: " + currentCivilWars + " civil wars!");
        }
      }else{
        msg.channel.send("Insufficient Permissions!");
      }
      commandUsed = true;
  }

  else if (command == "points"){
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]points @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    if (!botVars.regUsers[targetUser]){
      msg.channel.send("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
    }
    msg.channel.send(bot.users.get(targetUser) + " has " + botVars.regUsers[targetUser].points + " points!");
    commandUsed = true;
  }

  else if (command == "quests"){
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]quests @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    if (!botVars.regUsers[targetUser]){
      msg.channel.send("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
    }
    msg.channel.send(bot.users.get(targetUser) + " has " + botVars.regUsers[targetUser].quests + " quests!");
    commandUsed = true;
  }

  else if (command == "civilwars"){
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]civilwars @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    if (!botVars.regUsers[targetUser]){
      msg.channel.send("No points account!" + '\n' + "Type [p]ptsreg @[username] to register the user to the points system!");
    }
    msg.channel.send(bot.users.get(targetUser) + " has " + botVars.regUsers[targetUser].civilWars + " civil wars!");
    commandUsed = true;
  }

  //Auto-roles

  else if (command == "addptrole"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    if (botVars.permsUsersList[msg.author.id].isAdmin != true){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    let numPoints = args[0];
    if (!args[0]){
      msg.channel.send("`Usage: [p]addptrole [number of points] [role]`");
      return;
    }
    let roleName = args.slice(1).toString().replace(/,/g, ' ')
    if (!msg.guild.roles.find("name", roleName.toString())){
      msg.channel.send("`Usage: [p]addptrole [number of points] [role]`");
      return;
    }
    targetRole = msg.guild.roles.find("name", roleName).id;
    if (!pointRoles[msg.guild.id]){
      pointRoles[msg.guild.id] = {"0": {roleid: targetRole, points: numPoints}};
      fs.writeFile('./pointRoles.json', JSON.stringify(pointRoles), console.error);
      let added = [];
      for (let j = 0; j < botVars.settings["numUsers"].value; j++){
        let got = msg.guild.members.get(botVars.userList[j.toString()].id);
        if (got){
          if (botVars.regUsers[botVars.userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.send("Added role " + msg.guild.roles.get(targetRole) + " to: " + added + "!");
    }else{
      let i = 0;
      while (pointRoles[msg.guild.id][i.toString()]){
        if (pointRoles[msg.guild.id][i.toString()]){
          if (pointRoles[msg.guild.id][i.toString()].roleid == targetRole){
            msg.channel.send("This role is already an autorole!");
            return;
          }
        }
        i++;
        if (i > 14){
          msg.channel.send("There cannot be more than 15 point roles per server!");
          return;
        }
      }
      pointRoles[msg.guild.id][i.toString()] = {roleid: targetRole, points: numPoints};
      fs.writeFile('./pointRoles.json', JSON.stringify(pointRoles), console.error);
      let added = [];
      for (let j = 0; j < botVars.settings["numUsers"].value; j++){
        let got = msg.guild.members.get(botVars.userList[j.toString()].id);
        if (got){
          if (botVars.regUsers[botVars.userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.send("Added role " + msg.guild.roles.get(targetRole.toString()) + " to: " + added + "!");
    }
    commandUsed = true;
  }

  else if (command == "addquestrole"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    if (botVars.permsUsersList[msg.author.id].isAdmin != true){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    let numPoints = args[0];
    if (!args[0]){
      msg.channel.send("`Usage: [p]addquestrole [number of quests] [role]`");
      return;
    }
    let roleName = args.slice(1).toString().replace(/,/g, ' ')
    if (!msg.guild.roles.find("name", roleName.toString())){
      msg.channel.send("`Usage: [p]addquestrole [number of quests] [role]`");
      return;
    }
    targetRole = msg.guild.roles.find("name", roleName).id;
    if (!questRoles[msg.guild.id]){
      questRoles[msg.guild.id] = {"0": {roleid: targetRole, quests: numPoints}};
      fs.writeFile('./questRoles.json', JSON.stringify(questRoles), console.error);
      let added = [];
      for (let j = 0; j < botVars.settings["numUsers"].value; j++){
        let got = msg.guild.members.get(botVars.userList[j.toString()].id);
        if (got){
          if (botVars.regUsers[botVars.userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.send("Added role " + msg.guild.roles.get(targetRole) + " to: " + added + "!");
    }else{
      let i = 0;
      while (questRoles[msg.guild.id][i.toString()]){
        if (questRoles[msg.guild.id][i.toString()]){
          if (questRoles[msg.guild.id][i.toString()].roleid == targetRole){
            msg.channel.send("This role is already an autorole!");
            return;
          }
        }
        i++;
        if (i > 14){
          msg.channel.send("There cannot be more than 15 quest roles per server!");
          return;
        }
      }
      questRoles[msg.guild.id][i.toString()] = {roleid: targetRole, quests: numPoints};
      fs.writeFile('./questRoles.json', JSON.stringify(questRoles), console.error);
      let added = [];
      for (let j = 0; j < botVars.settings["numUsers"].value; j++){
        let got = msg.guild.members.get(botVars.userList[j.toString()].id);
        if (got){
          if (botVars.regUsers[botVars.userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.send("Added role " + msg.guild.roles.get(targetRole.toString()) + " to: " + added + "!");
    }
    commandUsed = true;
  }

  else if (command == "addcivilwarrole"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    if (botVars.permsUsersList[msg.author.id].isAdmin != true){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    let numPoints = args[0];
    if (!args[0]){
      msg.channel.send("`Usage: [p]addcivilwarrole [number of civil warss] [role]`");
      return;
    }
    let roleName = args.slice(1).toString().replace(/,/g, ' ')
    if (!msg.guild.roles.find("name", roleName.toString())){
      msg.channel.send("`Usage: [p]addcivilwarrole [number of civil wars] [role]`");
      return;
    }
    targetRole = msg.guild.roles.find("name", roleName).id;
    if (!civilWarRoles[msg.guild.id]){
      civilWarRoles[msg.guild.id] = {"0": {roleid: targetRole, civilwars: numPoints}};
      fs.writeFile('./civilWarRoles.json', JSON.stringify(civilWarRoles), console.error);
      let added = [];
      for (let j = 0; j < botVars.settings["numUsers"].value; j++){
        let got = msg.guild.members.get(botVars.userList[j.toString()].id);
        if (got){
          if (botVars.regUsers[botVars.userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.send("Added role " + msg.guild.roles.get(targetRole) + " to: " + added + "!");
    }else{
      let i = 0;
      while (questRoles[msg.guild.id][i.toString()]){
        if (questRoles[msg.guild.id][i.toString()]){
          if (questRoles[msg.guild.id][i.toString()].roleid == targetRole){
            msg.channel.send("This role is already an autorole!");
            return;
          }
        }
        i++;
        if (i > 14){
          msg.channel.send("There cannot be more than 15 civil war roles per server!");
          return;
        }
      }
      civilWarRoles[msg.guild.id][i.toString()] = {roleid: targetRole, civilwars: numPoints};
      fs.writeFile('./civilWarRoles.json', JSON.stringify(civilWarRoles), console.error);
      let added = [];
      for (let j = 0; j < botVars.settings["numUsers"].value; j++){
        let got = msg.guild.members.get(botVars.userList[j.toString()].id);
        if (got){
          if (botVars.regUsers[botVars.userList[j.toString()].id.toString()].points >= numPoints){
            got.addRole(targetRole).catch(console.error);
            added.push(got);
          }
        }
      }
      msg.channel.send("Added role " + msg.guild.roles.get(targetRole.toString()) + " to: " + added + "!");
    }
    commandUsed = true;
  }

  else if (command == "randbuild"){
    let a = [0, 0, 0, 0, 0, 0, 0, 0];
    let regSmasher = false;
    let limit = 7;
    if (args[0] == "-smasher" || args[0] == "-landmine" || args[0] == "-spike"){
      regSmasher = true;
      a = [0, 0, 0, 0];
      limit = 10;
    }
    if (args[0] == "-autosmasher"){
      limit = 10;
    }
    for (let i = 0; i < 33; i){
      if (!regSmasher){
        let rand = Math.floor(Math.random()*8);
        if (a[rand] < limit){
          a[rand]++;
          i++;
        }
      }else{
        let rand = Math.floor(Math.random()*4);
        if (a[rand] < limit){
          a[rand]++;
          i++;
        }
      }
    }
    if (!regSmasher){
      msg.channel.send(`Random build: \`${a[0]}/${a[1]}/${a[2]}/${a[3]}/${a[4]}/${a[5]}/${a[6]}/${a[7]}\``);
    }else{
      msg.channel.send(`Random build: \`${a[0]}/${a[1]}/${a[2]}/${a[3]}\``);
    }
  }

  //Anti-raid protection

  /*else if (command == "idraider"){
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]idraider @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    for (let i = 0; i < botVars.settings["numUsers"].value; i++){
      if (botVars.permsUsersList[botVars.userList[i.toString()].id]){
        if(!bot.user.fetchProfile(msg.mentions.first().id)){
          return;
        }
        bot.users.get(botVars.userList[i.toString()].id).send(bot.users.get(botVars.userList[i.toString()].id) + " ID of raider: " + targetUser + "! Username: " + msg.mentions.users.first().username + "!");
      }
    }
    msg.channel.send("Raider identified as: " + targetUser + "! Staff has been notified!");
    commandUsed = true;
  }*/

  //Anti-raid protection

  else if (command == "idraider"){
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]idraider @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    for (let i = 0; i < botVars.settings["numUsers"].value; i++){
      if (botVars.permsUsersList[botVars.userList[i.toString()].id]){
        bot.users.get(botVars.userList[i.toString()].id).send(bot.users.get(botVars.userList[i.toString()].id) + " ID of raider: " + targetUser + "! Username: " + msg.mentions.users.first().username + "!");
      }
    }
    msg.channel.send("Raider identified as: " + targetUser + "! Staff has been notified!");
    commandUsed = true;
  }

  else if (command == "userid"){
    if (!msg.mentions.users.first()){
      msg.channel.send("`Usage: [p]userid @mention`");
      return;
    }
    let targetUser = msg.mentions.users.first().id;
    msg.channel.send("User ID of " + msg.mentions.users.first() + ": "+ targetUser);
    commandUsed = true;
  }

  else if (command == "globalkick"){
    if (!botVars.permsUsersList[msg.author.id]){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[msg.author.id].isAdmin != true)){
      msg.channel.send("Insufficient permissions!");
      return;
    }
    if (!args[0]){
      msg.channel.send("`Usage: [p]globalkick [userID or @mention]`");
      return;
    }
    if (msg.mentions.users.first()){
      args[0] = msg.mentions.users.first().id;
    }
    bot.user.fetchProfile(args[0]);
    let targetUser = args[0];
    if (targetUser == "197592250354499584"){
      msg.channel.send("Insufficient permissions! You cannot kick bot owner!");
      return;
    }
    if (isNaN(parseInt(targetUser))){
      msg.channel.send("Make sure the argument is a user ID!");
      return;
    }
    if ((msg.author.id != "197592250354499584") && (botVars.permsUsersList[args[0]])){
        if (botVars.permsUsersList[args[0]].isAdmin == true){
        msg.channel.send("Insufficient permissions!");
        return;
      }
    }
    let serverid = 0;
    let servername = "";
    let allServers = [];
    bot.guilds.forEach((guild) => {allServers.push(guild);});
    for (let i = 0; i < allServers.length; i++){
      let xx = i.toString();
      if (bot.guilds.get(allServers[xx].id)){
      if (bot.guilds.get(allServers[xx].id).members.get(targetUser.toString())){
        serverid = allServers[xx].id;
        servername = allServers[xx].name;
        if (!bot.guilds.get(allServers[xx].id).members.get(bot.user.id).hasPermission("KICK_MEMBERS")){
          msg.channel.send(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " cannot be kicked from " + servername + " (" + serverid + ")!");
          continue;
        }
        bot.guilds.get(serverid).members.get(targetUser.toString()).kick().catch(function(err){console.log(err);});
        msg.channel.send(bot.guilds.get(serverid).members.get(targetUser.toString()) + " (" + targetUser + ")" + " has been kicked from " + servername + " (" + serverid + ")!");
      }
    }
    }
    commandUsed = true;
  }

  //Bot status functions

  else if (command == "uptime"){
    msg.channel.send("Uptime: " + process.uptime()*1000 + "ms");
    commandUsed = true;
  }

  else if (command == "numregusers"){
    msg.channel.send("There are " + botVars.settings["numUsers"].value + " people registered to the quest system!");
    commandUsed = true;
  }

  else if (command == "numregservers"){
    msg.channel.send("Cup of Java is running on " + botVars.settings["numServers"].value + " servers!");
  }

  //Bot control functions

  else if ((command == "botdisable") && (msg.author.id === "197592250354499584")){
    botVars.botEnable = false;
    msg.channel.send("Bot disabled!");
    commandUsed = true;
  }

  else if ((command == "botrestart") && (msg.author.id === "197592250354499584")){
    msg.channel.send("Restarting!").then(() => {
      bot.user.setStatus('dnd').then(() => {
          process.exit("Restart");
        });
      });
  }

  else if ((command == "botshutdown") && (msg.author.id === "197592250354499584")){
    msg.channel.send("Shutting down!").then(() => {
      bot.user.setStatus('dnd').then(() => {
          process.exit(0);
      });
    });
  }

  else if (command == "help"){
    if (args[0] == "DM"){
      bot.users.get(msg.author.id).send("**[p] is prefix**" + '\n\n' +
      "**Bot Owner Only:**" + '\n' +
  "[p]setprefix [newprefix]: Sets new prefix for the bot.\n"+
  "[p]setgame [newgame]: Sets bot's game.\n"+
  "[p]permban [@mention or userid]: Kicks and permanently bans the user out of all servers running this bot.\n"+
  "[p]unpermban [userid]: Allows user to join again.\n"+
  "[p]addptsadmin [@mention]: Allows user to access bot admin commands.\n"+
  "[p]delptsadmin [@mention]: Prohibits user from accessing bot admin commands.\n"+
  "[p]botenable: Enables bot.\n"+
  "[p]botdisable: Disables bot.\n"+
  "[p]botshutdown: Shuts down bot.\n"+
  "[p]botrestart: Restarts bot. (Requires bot to be running from pm2)\n"+
  "**Bot Admin Only:**\n"+
  "[p]prune [number]: Deletes a number of messages from the channel.\n"+
  "[p]selfpts [enable/disable]: Sets whether mods can add their own points.\n"+
  "[p]tempmemes [enable/disable]: Sets whether meme commands are temporary.\n"+
  "[p]tempmemestime [ms]: Sets the time that temporary memes last.\n"+
  "[p]minmsglength [number]: Sets the minimum message length in characters.\n"+
  "[p]minmsgdeletetime [ms]: Sets the time before messages shorter than the limit are deleted.\n"+
  "[p]deletebannedmsgs [enable/disable]: Sets whether tempbanned and timebanned messages delete.\n"+
  "[p]deletebannedmsgstime [ms]: Sets the time until tempbanned and timebanned messages delete.\n"+
  "[p]latency [enable/disable]: Sets whether latency appears after each command.\n"+
  "[p]addptsmod [@mention]: Allows user to access bot mod commands.\n"+
  "[p]delptsmod [@mention]: Prohibits user from accessing bot mod commands.\n"+
  "[p]globalkick [userid or @mention]: Kicks user out of all servers running this bot.\n").then((sent1) => {
    bot.users.get(msg.author.id).send("**Bot Mod Only:**\n"+
  "[p]ptsadd [number] [@mention]: Adds points to user.\n"+
  "[p]questsadd [number] [@mention]: Adds quests to user.\n"+
  "[p]civilwarsadd [number] [@mention]: Adds civil wars to user.\n"+
  "[p]timeban [@mention]: Auto deletes the user's messages after a time.\n"+
  "[p]untimeban [@mention]: Removes time ban from user.\n"+
  "[p]tempban [ms] [@mention]: Auto deletes the user's messages for a specified amount of time.\n"+
  "[p]untempban [@mention]: Remove a temporary ban from the user.\n"+
  "**Everyone:**\n"+
  "[p]ping: Returns the bot's latency.\n"+
  "[p]trump [optional argument]: Returns WE MUST BUILD A WALL without argument, Make [argument] great again! with argument.\n"+
  "[p]trumpmeme: Shows a trump meme.\n"+
  "[p]thereisabug [text]: Reports a bug.\n"+
  "[p]suggestion [text]: Give a suggestion for the bot.\n"+
  "[p]serverreg: Registers the server to the system.\n"+
  "[p]points [@mention]: Shows the user's points.\n"+
  "[p]quests [@mention]: Shows the user's quests.\n"+
  "[p]civilwars [@mention]: Shows the user's civil wars.\n"+
  "[p]idraider [@mention]: Notifies staff that the user is a raider. **ABUSE WILL RESULT IN A BAN!!!**\n"+
  "[p]userid [@mention]: Gives the user's ID.\n"+
  "[p]uptime: Gives the bot's uptime.\n"+
  "[p]numregusers: Gives the number of users registered to the system.\n"+
  "[p]numregservers: Gives the number of servers registered to the system.\n"+
  "[p]help [optional argument 'DM']: Shows this.\n"+
  "[p]nebulayt: Gives the link to our Nebula YouTube channel.\n"+
  "**[p]christmas: Limited edition command! Gives Christmas pictures!**");
  return;
});
  }else
    msg.channel.send("**[p] is prefix**" + '\n\n' +
    "**Bot Owner Only:**" + '\n' +
"[p]setprefix [newprefix]: Sets new prefix for the bot.\n"+
"[p]setgame [newgame]: Sets bot's game.\n"+
"[p]permban [@mention or userid]: Kicks and permanently bans the user out of all servers running this bot.\n"+
"[p]unpermban [userid]: Allows user to join again.\n"+
"[p]addptsadmin [@mention]: Allows user to access bot admin commands.\n"+
"[p]delptsadmin [@mention]: Prohibits user from accessing bot admin commands.\n"+
"[p]botenable: Enables bot.\n"+
"[p]botdisable: Disables bot.\n"+
"[p]botshutdown: Shuts down bot.\n"+
"[p]botrestart: Restarts bot. (Requires bot to be running from pm2)\n"+
"**Bot Admin Only:**\n"+
"[p]prune [number]: Deletes a number of messages from the channel.\n"+
"[p]selfpts [enable/disable]: Sets whether mods can add their own points.\n"+
"[p]tempmemes [enable/disable]: Sets whether meme commands are temporary.\n"+
"[p]tempmemestime [ms]: Sets the time that temporary memes last.\n"+
"[p]minmsglength [number]: Sets the minimum message length in characters.\n"+
"[p]minmsgdeletetime [ms]: Sets the time before messages shorter than the limit are deleted.\n"+
"[p]deletebannedmsgs [enable/disable]: Sets whether tempbanned and timebanned messages delete.\n"+
"[p]deletebannedmsgstime [ms]: Sets the time until tempbanned and timebanned messages delete.\n"+
"[p]latency [enable/disable]: Sets whether latency appears after each command.\n"+
"[p]addptsmod [@mention]: Allows user to access bot mod commands.\n"+
"[p]delptsmod [@mention]: Prohibits user from accessing bot mod commands.\n"+
"[p]globalkick [userid or @mention]: Kicks user out of all servers running this bot.\n").then((sent1) => {
  msg.channel.send("**Bot Mod Only:**\n"+
"[p]ptsadd [number] [@mention]: Adds points to user.\n"+
"[p]questsadd [number] [@mention]: Adds quests to user.\n"+
"[p]civilwarsadd [number] [@mention]: Adds civil wars to user.\n"+
"[p]timeban [@mention]: Auto deletes the user's messages after a time.\n"+
"[p]untimeban [@mention]: Removes time ban from user.\n"+
"[p]tempban [ms] [@mention]: Auto deletes the user's messages for a specified amount of time.\n"+
"[p]untempban [@mention]: Remove a temporary ban from the user.\n"+
"**Everyone:**\n"+
"[p]ping: Returns the bot's latency.\n"+
"[p]trump [optional argument]: Returns WE MUST BUILD A WALL without argument, Make [argument] great again! with argument.\n"+
"[p]trumpmeme: Shows a trump meme.\n"+
"[p]thereisabug [text]: Reports a bug.\n"+
"[p]suggestion [text]: Give a suggestion for the bot.\n"+
"[p]serverreg: Registers the server to the system.\n"+
"[p]points [@mention]: Shows the user's points.\n"+
"[p]quests [@mention]: Shows the user's quests.\n"+
"[p]civilwars [@mention]: Shows the user's civil wars.\n"+
"[p]idraider [@mention]: Notifies staff that the user is a raider. **ABUSE WILL RESULT IN A BAN!!!**\n"+
"[p]userid [@mention]: Gives the user's ID.\n"+
"[p]uptime: Gives the bot's uptime.\n"+
"[p]numregusers: Gives the number of users registered to the system.\n"+
"[p]numregservers: Gives the number of servers registered to the system.\n"+
"[p]help [optional argument 'DM']: Shows this.\n"+
"[p]nebulayt: Gives the link to our Nebula YouTube channel.\n"+
"**[p]christmas: Limited edition command! Gives Christmas pictures!**").then((sent2) => {
  sent2.delete(30000);
});
sent1.delete(30000)
});
  }

  if (command == "botsetmode"){
    if (!msg.author.id == "197592250354499584"){
      msg.channel.send("Insufficient Permissions!");
      return;
    }
    if (args[1]){
      if (args[1].toLowerCase() == "-nickname"){
        if (args[0] == "Lillie"){
          msg.guild.members.get(bot.user.id).setNickname("Lillie");
          bot.user.setAvatar("https://miketendo64.files.wordpress.com/2016/06/1a.png?w=657&h=657");
          return;
        }
        if (args[0] == "CupOfJava"){
          msg.guild.members.get(bot.user.id).setNickname("Cup of Java");
          bot.user.setAvatar("http://cdn.onlyinyourstate.com/wp-content/uploads/2016/03/7417277818_24db95a92e_b-700x547.jpg");
          return;
        }
      }
      if (args[1].toLowerCase() == "-setusername"){
        if (args[0] == "Lillie"){
          bot.user.setUsername("Lillie");
          bot.user.setAvatar("https://miketendo64.files.wordpress.com/2016/06/1a.png?w=657&h=657");
          return;
        }
        if (args[0] == "CupOfJava"){
          bot.user.setUsername("Cup of Java");
          bot.user.setAvatar("http://cdn.onlyinyourstate.com/wp-content/uploads/2016/03/7417277818_24db95a92e_b-700x547.jpg");
          return;
        }
      }
    }else if (!args[1]){
      msg.channel.send("Use `-nickname or -setusername`!");
      return;
    }
    msg.channel.send("Mode does not exist!");
  }

  else if (command == "jointribe"){
    if (!args[0]){
      msg.channel.send("`Usage: [p]jointribe [in-game name]`");
      return;
    }
    quenes[args.join(" ")] = { expire: Date.now() + _settings.moo.requestTimeout, by: msg.member };
    msg.reply("Request sent successfully! Please join with the name of `" + args.join(" ") + "` to be accepted. This will only last " + msToTime(_settings.moo.requestTimeout) + "!");
    return;
  }

  else if (command == "coords"){
    msg.reply(`I am at X = ${me.x}, Y = ${me.y}. Do \`[p]map\` for a map.`);
    return;
  }

  else if (command == "map"){
    if (args[0] == "-b"){
      msg.reply("I am at:\n" + mapbig(me.x, me.y));
    }else{
      msg.reply("I am at:\n" + map(me.x, me.y));
    }
    return;
  }

  else if (command == "autoattack"){
    if (args[0] && args[0].toLowerCase() == "-disable"){
      msg.reply("Auto-attack disabled!");
      following = autohunt = hunting = null;
      editableGlobal.moo.autoAttack = autohunt;
      bot.channels.get(editableGlobalChannel).fetchMessage(editableGlobalMsgID).then((m)=>{
        m.edit(JSON.stringify(editableGlobal));
      });
      reset();
      return;
    }
    if (!args[0]){
      autohunt = true;
      msg.reply("Now auto-attacking!");
      keys["m"] = 0;
      editableGlobal.moo.autoAttack = autohunt;
      bot.channels.get(editableGlobalChannel).fetchMessage(editableGlobalMsgID).then((m)=>{
        m.edit(JSON.stringify(editableGlobal));
      });
      return;
    }
      autohunt = false;
      keys["m"] = 0;
      for (var j in players) {
        if (players[j].name === args.join(" ")){
          hunting = players[j];
          msg.reply(`Auto-attacking ${args.join(" ")}!`);
          return;
        }
      }
      msg.reply(`404 Error: Not found. Make sure they are/have been nearby.`);
  }

  else if (command == "listplayers"){
    let names = [];
    players.forEach((p)=>{
      names.push(p.name);
    });
    msg.channel.send(names.join("\n"));
  }

  else if (command == "partylink"){
    msg.reply("The current link is: http://moomoo.io/?party=" + editableGlobal.moo.partyLink + " ! Type [p]jointribe [in-game name] and join " + _settings.moo.alliance + "!");
  }

  else if (command == "setpartylink"){
    if (botVars.permsUsersList[msg.author.id]){
      if (botVars.permsUsersList[msg.author.id].isAdmin){
        let address = args[0].replace("http://", "").replace("moomoo.io", "").replace("/", "").replace("?party=", "");
        if (validIP(address)){
          editableGlobal.moo.partyLink = address;
          bot.channels.get(editableGlobalChannel).fetchMessage(editableGlobalMsgID).then((m)=>{
            m.edit(JSON.stringify(editableGlobal));
          });
          socket.close();
          msg.reply("Party Link set to: `" + address + "`!");
          dump("Party Link set to: `" + address + "`!");
        }else{
          msg.reply("Invalid Link!");
        }
      }else{
        msg.channel.send("Insufficient Permissions!");
        return;
      }
    }else{
      msg.channel.send("Insufficient Permissions!");
      return;
    }
  }

  else if (command == "connect"){
    if (botVars.permsUsersList[msg.author.id]){
      if (botVars.permsUsersList[msg.author.id].isAdmin){
        connect();
        msg.reply("Connected!");
      }else{
        msg.channel.send("Insufficient Permissions!");
        return;
      }
    }else{
      msg.channel.send("Insufficient Permissions!");
      return;
    }
  }

  else if (command == "disconnect"){
    if (botVars.permsUsersList[msg.author.id]){
      if (botVars.permsUsersList[msg.author.id].isAdmin){
        socket.close();
        msg.reply("Disconnected!");
      }else{
        msg.channel.send("Insufficient Permissions!");
        return;
      }
    }else{
      msg.channel.send("Insufficient Permissions!");
      return;
    }
  }

  if (botVars.settings["latency"].value == true && commandUsed == true) {
    msg.channel.send("Latency:").then((sent) => {
      let t = sent.createdTimestamp - msg.createdTimestamp;
      sent.edit("Latency: " + t + "ms");
      sent.delete(5000);
    });
  }
  if (!msg.author.id === "197592250354499584"){
    msg.channel.send("Insufficient Permissions!");
    return;
  }
  else if(command == "eval" && msg.author.id === "197592250354499584") {
    try {
      var code = args.join(" ");
      var evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      msg.channel.send(\`\`\`xl\n${evaled}\n\`\`\``);
    } catch(err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
  }
}
});

bot.login(process.env.TOKEN);
botVars.spy.login(process.env.botVars.spy);
