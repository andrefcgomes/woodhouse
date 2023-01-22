require("dotenv").config();
const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const validators = require("./lib/validators");
const { commands, extractCommandAndArgsFromMessage } = require("./lib/commands");


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{
      name: "a tua cota de 4",
      type: ActivityType.Watching,
      url: "https://apav.pt",
    }],
    status: "dnd",
  });
});

client.on(Events.MessageCreate, async (message) => {
  if (validators.IS_BOT_MESSAGE(message)) {
    if (!validators.NOT_FROM_A_BOT(message)) {
      return;
    }
    if (!validators.IN_GUILD(message)) {
      message.reply("wtf");
      return;
    }
    if (!validators.USER_IN_CHANNEL(message)) {
      message.reply("You need to join a voice channel first!");
      return;
    }

    const [command, args] = extractCommandAndArgsFromMessage(message);
    if (command in commands) {
      return commands[command].f(message, args);
    }
  }
});

client.login(process.env.TOKEN);
