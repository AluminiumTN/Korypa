const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
  .setName('addwords')
  .setDescription('Write words in database when you tag bot')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addStringOption(option => option.setName('wrods').setDescription('Write here words and bot catch messages with this word from database').setRequired(true)),

  async execute(interaction) {

		
    const words = interaction.options.getString('wrods');
    const serverId = interaction.guild.name;

    const path = `./JSON/${serverId}/badwords.json`;

    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([], null, 2));
    }

    fs.readFile(path, (err, content) => {
      if (err) throw err;
      const word = JSON.parse(content);

      if (!word.includes(words)) {
        word.push(words);

        fs.writeFile(path, JSON.stringify(word, null, 2), (err) => {
          if (err) throw err;
          interaction.reply({content: `Added ${words}`, ephemeral: true});
        });
      } else {
        interaction.reply({content: `Added ${words}`, ephemeral: true});
      }
    });
  },
};
