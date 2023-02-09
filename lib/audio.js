const { createAudioResource, getVoiceConnection, createAudioPlayer } = require("@discordjs/voice");
const yts = require("yt-search");
const ytdl = require("ytdl-core");

let currentPlayer = null;
let currentVolume = 1;
let currentResource = null;

const playSound = (channel, file, inline_volume = true) => {
    currentPlayer = createAudioPlayer();
    // const options = {
    //     inlineVolume: inline_volume,
    //     metadata: {
    //         title: 'A tua tia',
    //     },
    // };
    currentResource = createAudioResource(file);
    // currentResource.volume.setVolume(currentVolume);
    const connection = getVoiceConnection(channel.guild.id);
    currentPlayer.play(currentResource);

    connection.subscribe(currentPlayer);
}

const getYoutubeAudio = (url) => {
    return ytdl(url, {
        filter: "audioonly",
    });
}

const getLuckyYoutubeURL = async (searchString) => {
    const r = await yts(searchString);
    return r.videos[0].url;
}

const setVolume = (volume) => {
    currentVolume = parseInt(volume) / 100;
    currentResource.volume.setVolume(currentVolume);
}

const stopPlayer = () => {
    if (currentPlayer != null) {
        currentPlayer.stop();
        currentPlayer = null;
    }
}


module.exports = { playSound, getYoutubeAudio, getLuckyYoutubeURL, setVolume, stopPlayer }

