exports.exec = (bot, msg, args) => {
  return new Promise((resolve, reject) => {
    botVars.botEnable = true;
    msg.channel.send("Bot enabled!");
    resolve(true);
  });
};

exports.permsRequired = 4;
