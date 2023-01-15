const fs = require("fs");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
module.exports = class Utils {
  doIfFileExists(filePath, callback) {
    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        console.error(`   SOUND NOT FOUND: ${filePath}`);
        return;
      }
      callback();
    });
  }

  getYoutubeAudio(url) {
    return ytdl(url, {
      filter: "audioonly",
    });
  }

  async getLuckyYoutubeURL(searchString) {
    const r = await yts(searchString);
    return r.videos[0].url;
  }

  getSoundListMarkdown() {
    const files = fs.readdirSync("sounds");
    return (
      "```" +
      "Sound list: \r\n" +
      files
        .map((key) => {
          return `${key.replace(".mp3", "")}`;
        })
        .join("\r\n") +
      "```"
    );
  }

  makeHelpMarkdown(commands) {
    return (
      "```" +
      "Command list: \r\n" +
      Object.keys(commands)
        .map((key) => {
          return `.${key}: ${commands[key].desc}`;
        })
        .join("\r\n") +
      "```"
    );
  }

  extractCommandAndArgsFromMessage(message) {
    const processed_message = message.content.split(" ");
    const command = processed_message[0].slice(1); //command is after "." and before " "
    const args = processed_message.slice(1);
    return [command, args];
  }

  extractCommandAndArgsFromAudio(message) {
    try {
      if (message.content) {
        const tokens = message.content.toLowerCase().split(" ");
        if (tokens[0] === "alexa" && tokens.length >= 2) {
          const command = tokens[1];
          const args = tokens.slice(2);
          return [command, args];
        }
      }
    } catch (e) {
      console.error(`SPEECH ERROR: `, e);
    }
    return [null, null];
  }
};
