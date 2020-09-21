Const Discord = require(“discord.js”);

Const { gb!, NzI5Mjg1NTQ0NjQ2OTM0NTkw.XwGuFw.ndJdng-OuP8L23fM2JirT-80TE8 } = require(“./config.json”);

Const ytdl = require(“ytdl-core”);



Const client = new Discord.Client();



Const queue = new Map();



Client.once(“ready”, () => {

  Console.log(“Ready!”);

});



Client.once(“reconnecting”, () => {

  Console.log(“Reconnecting!”);

});



Client.once(“disconnect”, () => {

  Console.log(“Disconnect!”);

});



Client.on(“message”, async message => {

  If (message.author.bot) return;

  If (!message.content.startsWith(gb!)) return;



  Const serverQueue = queue.get(message.guild.id);



  If (message.content.startsWith(`${gb!}play`)) {

    Execute(message, serverQueue);

    Return;

  } else if (message.content.startsWith(`${gb!}skip`)) {

    Skip(message, serverQueue);

    Return;

  } else if (message.content.startsWith(`${gb!}stop`)) {

    Stop(message, serverQueue);

    Return;

  } else {

    Message.channel.send(“You need to enter a valid command!”);

  }

});



Async function execute(message, serverQueue) {

  Const args = message.content.split(“ “);



  Const voiceChannel = message.member.voice.channel;

  If (!voiceChannel)

    Return message.channel.send(

      “You need to be in a voice channel to play music!”

    );

  Const permissions = voiceChannel.permissionsFor(message.client.user);

  If (!permissions.has(“CONNECT”) || !permissions.has(“SPEAK”)) {

    Return message.channel.send(

      “I need the permissions to join and speak in your voice channel!”

    );

  }



  Const songInfo = await ytdl.getInfo(args[1]);

  Const song = {

    Title: songInfo.title,

    url: songInfo.video_url

  };



  If (!serverQueue) {

    Const queueContruct = {

      textChannel: message.channel,

      voiceChannel: voiceChannel,

      connection: null,

      songs: [],

      volume: 5,

      playing: true

    };



    Queue.set(message.guild.id, queueContruct);



    queueContruct.songs.push(song);



    try {

      var connection = await voiceChannel.join();

      queueContruct.connection = connection;

      play(message.guild, queueContruct.songs[0]);

    } catch (err) {

      Console.log(err);

      Queue.delete(message.guild.id);

      Return message.channel.send(err);

    }

  } else {

    serverQueue.songs.push(song);

    return message.channel.send(`${song.title} has been added to the queue!`);

  }

}



Function skip(message, serverQueue) {

  If (!message.member.voice.channel)

    Return message.channel.send(

      “You have to be in a voice channel to stop the music!”

    );

  If (!serverQueue)

    Return message.channel.send(“There is no song that I could skip!”);

  serverQueue.connection.dispatcher.end();

}



Function stop(message, serverQueue) {

  If (!message.member.voice.channel)

    Return message.channel.send(

      “You have to be in a voice channel to stop the music!”

    );

  serverQueue.songs = [];

  serverQueue.connection.dispatcher.end();

}



Function play(guild, song) {

  Const serverQueue = queue.get(guild.id);

  If (!song) {

    serverQueue.voiceChannel.leave();

    queue.delete(guild.id);

    return;

  }



  Const dispatcher = serverQueue.connection

    .play(ytdl(song.url))

    .on(“finish”, () => {

      serverQueue.songs.shift();

      play(guild, serverQueue.songs[0]);

    })

    .on(“error”, error => console.error(error));

  Dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(`Start playing: **${song.title}**`);

}



Client.login(NzI5Mjg1NTQ0NjQ2OTM0NTkw.XwGuFw.ndJdng-OuP8L23fM2JirT-80TE8);




