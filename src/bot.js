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
      console.log(`${message.author.tag} is using the microwave.`)
      message.reply("Microwaving your food...");
   };
   player.on(AudioPlayerStatus.Idle, () => {
      player.stop();
      connection.destroy();
      message.reply("Your food is done!");
      console.log(`${message.author.tag} is done using the microwave.`)
   });
   player.on('error', error => {
      console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
      player.play(getNextResource());
   });
});
client.login(config.token);