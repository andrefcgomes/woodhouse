module.exports = {
  IN_GUILD: (message) => {  return message.guild; },
  IS_BOT_MESSAGE: (message) => {return message.content[0] === "."},
  USER_IN_CHANNEL: (message) => {return message.member.voice.channel },
  NOT_FROM_A_BOT: (message) => {return !message.author.bot}
};
