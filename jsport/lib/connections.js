class Connection {
  connection = null;
  volume = 0.5;
  dispatcher = null;

  constructor(connection) {
    this.connection = connection;
  }

  get id() {
    return this.connection && this.connection.channel.id
      ? this.connection.channel.id
      : 123;
  }

  //thing can be a file path or a ytdl call
  playSound(thing) {
    const playOptions = {
      volume: this.volume,
    };
    this.dispatcher = this.connection
      .play(thing, playOptions)
      .on("finish", () => {
        // console.log("Finished playing!");
        this.dispatcher = null;
      });
  }

  stopPlayback() {
    if (this.dispatcher !== null) {
      this.dispatcher.destroy();
      this.dispatcher = null;
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.dispatcher !== null) {
      this.dispatcher.setVolume(this.volume);
    }
    // console.log(`VOLUME CHANGED TO ${this.volume}`);
  }
}

module.exports = class ConnectionManager {
  connections = [];

  getConnection(channel) {
    return this.connections.find((item) => {
      // console.log("TRYNA FIND:", item.id, channel.id);
      return item.id === channel.id;
    });
  }

  deleteConnection(channel) {
    const idx = this.connections.findIndex((item) => item.id === channel.id);
    this.connections[idx].connection.disconnect();
    return this.connections.splice(idx, 1);
  }

  storeConnection(channel) {
    if (!this.getConnection(channel)) {
      this.connections.push(new Connection(channel));
      return true;
    }
    return false;
  }
};
