const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const { playSound, getYoutubeAudio, setVolume, stopPlayer, getLuckyYoutubeURL } = require("./audio");
const { getSoundListMarkdown, makeHelpMarkdown } = require("./messages");

const extractCommandAndArgsFromMessage = (message) => {
    const processed_message = message.content.split(" ");
    const command = processed_message[0].slice(1); //command is after "." and before " "
    const args = processed_message.slice(1);
    return [command, args];
}




//(message, args). all optional but all have to be the same or none
const commands = {
    join: {
        desc: "Calls the bot to a voice channel",
        f: async (message, args) => {
            const channel = message.member.voice.channel;
            const connection = getVoiceConnection(channel.guild.id);
            if (!connection) {
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                commands.s.f(message, ["ui"]);
            }
            else {
                message.reply("I'm already here dumbass...");
            }
        },
    },
    leave: {
        desc: "Makes bot leave from the current channel",
        f: (message, args) => {
            const channel = message.member.voice.channel;
            getVoiceConnection(channel.guild.id).destroy();
        },
    },
    s: {
        desc: "Plays a sound from the soundboard. Check .listsounds for more (example: .s toy)",
        f: async (message, args) => {
            const channel = message.member.voice.channel;
            const filePath = `sounds/${args.join(" ")}.mp3`;
            playSound(channel, filePath);
        },
    },
    yt: {
        desc: "Plays a youtube clip (example: .yt https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
        f: async (message, args) => {
            const channel = message.member.voice.channel;
            const sound = getYoutubeAudio(args[0]);
            playSound(channel, sound);
        },
    },
    volume: {
        desc: "Changes volume from 1-100 (example: .volume 50)",
        f: async (message, args) => {
            setVolume(args[0]);
            message.reply("Volume set to " + args[0]);

        },
    },
    stop: {
        desc: "Stops anything that's playing",
        f: async (message, args) => {
            stopPlayer();
        },
    },
    listsounds: {
        desc: "Lists the available sounds on the soundboard",
        f: (message) => {
            message.channel.send(getSoundListMarkdown());
        },
    },
    randomtube: {
        desc: "Plays the first video found with the given description (example: .randomtube 2 girls 1 cup)",
        f: async (message, args) => {
            const youtubeURL = await getLuckyYoutubeURL(args.join(" "));
            const channel = message.member.voice.channel;
            const sound = getYoutubeAudio(youtubeURL);
            playSound(channel, sound);
        },
    },
    help: {
        desc: "This message lol",
        f: (message, args) => {
            message.channel.send(makeHelpMarkdown(commands));
        },
    },
};

module.exports = { extractCommandAndArgsFromMessage, commands }