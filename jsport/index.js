require("dotenv").config();
const Discord = require("discord.js");

const validators = require("./lib/validators");
const ConnectionManager = require("./lib/connections");
const Utils = require("./lib/utils");
const { DiscordSR } = require('discord-speech-recognition');

const client = new Discord.Client();
const discordSR = new DiscordSR(client);
const connectionManager = new ConnectionManager();
const utils = new Utils();

//(message, args). all optional but all have to be the same or none
const commands = {
  join: {
    desc: "Calls the bot to a voice channel",
    f: async (message, args) => {
      const newConnection = await message.member.voice.channel.join();
      if (connectionManager.storeConnection(newConnection)) {
        commands.s.f(message, ["ui"]);
      } else {
        message.reply("I'm already here dumbass...");
      }
    },
  },
  leave: {
    desc: "Makes bot leave from the current channel",
    f: (message, args) => {
      connectionManager.deleteConnection(message.member.voice.channel);
    },
  },
  s: {
    desc: "Plays a sound from the soundboard. Check .listsounds for more (example: .s toy)",
    f: async (message, args) => {
      const filePath = `sounds/${args.join(" ")}.mp3`;
      utils.doIfFileExists(filePath, () => {
        connectionManager
          .getConnection(message.member.voice.channel)
          .playSound(filePath);
      });
    },
  },
  yt: {
    desc: "Plays a youtube clip (example: .yt https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
    f: async (message, args) => {
      connectionManager
        .getConnection(message.member.voice.channel)
        .playSound(utils.getYoutubeAudio(args[0]));
    },
  },
  volume: {
    desc: "Changes volume from 1-100 (example: .volume 50)",
    f: async (message, args) => {
      connectionManager
        .getConnection(message.member.voice.channel)
        .setVolume(parseInt(args[0]) / 100);
    },
  },
  stop: {
    desc: "Stops anything that's playing",
    f: async (message, args) => {
      connectionManager
        .getConnection(message.member.voice.channel)
        .stopPlayback();
    },
  },
  listsounds: {
    desc: "Lists the available sounds on the soundboard",
    f: (message) => {
      const fileListMarkdown = utils.getSoundListMarkdown();
      message.channel.send(fileListMarkdown);
    },
  },
  randomtube: {
    desc: "Plays the first video found with the given description (example: .randomtube 2 girls 1 cup)",
    f: async (message, args) => {
      const youtubeURL = await utils.getLuckyYoutubeURL(args.join(" "));
      connectionManager
        .getConnection(message.member.voice.channel)
        .playSound(utils.getYoutubeAudio(youtubeURL));
    },
  },
  help: {
    desc: "This message lol",
    f: (message, args) => {
      message.channel.send(utils.makeHelpMarkdown(commands));
    },
  },
};

const speechCommands = {
  play: {
    f: (msg,args) => {
      commands.s.f(msg,args);
    },
  },
  youtube: {
    f: (msg,args) => {
      commands.randomtube.f(msg,args);
    },
  },
  stop: {
    f: (msg,args) => {
      commands.stop.f(msg,args);
    },
  },
};


client.on("speech", (msg) => {
  const [command, args] = utils.extractCommandAndArgsFromAudio(msg);
  if (command in speechCommands) {
    return speechCommands[command].f(msg,args);
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activity: {
      name: "a tua cota de 4",
      type: "STREAMING",
      url: "https://apav.pt",
    },
    status: "dnd",
  });
});

client.on("message", async (message) => {
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

    const [command, args] = utils.extractCommandAndArgsFromMessage(message);
    if (command in commands) {
      return commands[command].f(message, args);
    }
  }
});

client.login(process.env.TOKEN);
