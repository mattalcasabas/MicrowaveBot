const Discord = require("discord.js");
const config = require("../config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });
const { getVoiceConnection, joinVoiceChannel, AudioPlayerStatus, createAudioResource, getNextResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
client.once("ready", () => {
   console.log("Ready to microwave...");
   client.user.setActivity("with your food!")
   client.user.setStatus("idle");
});
client.on("error", error => {
   console.log(error);
   return;
});
client.on("messageCreate", async message => {
   if (message.author.bot) return;
   if (message.content.toLowerCase() === "ping") {
      message.reply("The **API** ping is " + "`" + client.ws.ping + "ms`. " + `The **message** ping is ` + "`" + (Date.now() - message.createdTimestamp) + "ms`.")
   };
   if (message.content.toLowerCase().startsWith(config.prefix + "e")) {
      const args = message.content.split(" ").slice(1);
      if (message.author.id !== config.ownerID) return;
      const content = message.content.split(' ').slice(1).join(' ');
      const result = new Promise((resolve, reject) => resolve(eval(content)));
      return result.then(output => {
         if (typeof output !== 'string') output = require('util').inspect(output, {
            depth: 0
         });
         if (output.includes(client.token)) output = output.replace(client.token, '[Woah, umm, nope]');
         if (output.length > 1990) console.log(output), output = 'Too long to be printed (content got console logged)';
         return message.channel.send(output, {
            code: 'js'
         });
      }).catch(err => {
         console.error(err);
         err = err.toString();
         if (err.includes(client.token)) err = err.replace(client.token, '[Woah, umm, nope]');
         return message.channel.send(err, {
            code: 'js'
         });
      });
   };
});
client.on("messageCreate", async message => {
   if (message.author.bot) return;
   if (message.member.voice.channel == null) {
      return;
   }
   if (message.content.toLowerCase() !== ("microwave")) {
      return;
   };
   const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
   });
   const player = createAudioPlayer();
   const subscription = connection.subscribe(player);
   if (message.content.toLowerCase() === "microwave") {
      player.play(createAudioResource('./audio/microwave.wav'));
      message.reply("Microwaving your food...");
   };
   player.on(AudioPlayerStatus.Idle, () => {
      player.stop();
      connection.destroy();
   });
   player.on('error', error => {
      console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
      player.play(getNextResource());
   });
});
client.login(config.token);