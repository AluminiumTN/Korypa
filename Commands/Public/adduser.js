const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
  .setName('adduser')
  .setDescription('Add users in db that the bot will respond to when its tagged.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addStringOption(option => option.setName('userid').setDescription('Add user id').setRequired(true)),

  async execute(interaction) {

		
    const userId = interaction.options.getString('userid');
    const serverId = interaction.guild.name;

    const path = `./JSON/${serverId}/users.json`;

    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([], null, 2));
    }

    fs.readFile(path, (err, content) => {
      if (err) throw err;
      const userIds = JSON.parse(content);

      if (!userIds.includes(userId)) {
        userIds.push(userId);

        fs.writeFile(path, JSON.stringify(userIds, null, 2), (err) => {
          if (err) throw err;
          interaction.reply({content: `ID ${userId} added`, ephemeral: true});
        });
      } else {
        interaction.reply({content: `ID ${userId} already exist.`, ephemeral: true});
      }
    });
  },
};
