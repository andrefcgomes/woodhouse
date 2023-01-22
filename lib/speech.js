//old version. was hammered on index. TODO: port this to new js version

// const { DiscordSR } = require('discord-speech-recognition');
// const discordSR = new DiscordSR(client);
// const extractCommandAndArgsFromAudio = (message) => {
//     try {
//         if (message.content) {
//             const tokens = message.content.toLowerCase().split(" ");
//             if (tokens[0] === "alexa" && tokens.length >= 2) {
//                 const command = tokens[1];
//                 const args = tokens.slice(2);
//                 return [command, args];
//             }
//         }
//     } catch (e) {
//         console.error(`SPEECH ERROR: `, e);
//     }
//     return [null, null];
// }

// const speechCommands = {
//     play: {
//       f: (msg, args) => {
//         commands.s.f(msg, args);
//       },
//     },
//     youtube: {
//       f: (msg, args) => {
//         commands.randomtube.f(msg, args);
//       },
//     },
//     stop: {
//       f: (msg, args) => {
//         commands.stop.f(msg, args);
//       },
//     },
//   };
  
  
//   client.on("speech", (msg) => {
//     console.log("speech: "+msg);
//     const [command, args] = extractCommandAndArgsFromAudio(msg);
//     if (command in speechCommands) {
//       return speechCommands[command].f(msg,args);
//     }
//   });