const {PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {


        const serverId = message.guild.name;
        const path = `./JSON/${serverId}/emojis/emojis.json`;
        const channelsPath = `./JSON/${serverId}/channels/channels.json`;
      
        try {
          let reactions;
          if (fs.existsSync(path)) {
            reactions = JSON.parse(fs.readFileSync(path, 'utf8'));
          }
      
          let channels;
          if (fs.existsSync(channelsPath)) {
            channels = JSON.parse(fs.readFileSync(channelsPath, 'utf8')).channels;
          }
      
          const reactionProbability = 0.05;
      
          if (reactions && Math.random() <= reactionProbability && channels.includes(message.channel.id)) {
            const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      
            await message.react(reaction);
      
          }
        } catch (error) {
      
        }
    }
}
