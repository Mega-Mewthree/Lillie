exports.exec = (bot, msg, args) => {
  return new Promise((resolve, reject) => {
    msg.channel.send("Pong!").then((sent) => {
      let t = sent.createdTimestamp - msg.createdTimestamp;
      sent.edit(`Pong! ${t}ms`);
      resolve(true);
    }).catch(reject);
  });
};

exports.permsRequired = 0;
