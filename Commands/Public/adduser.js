const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
  .setName('добавить-хуесоса')
  .setDescription('Добавляет юзера в бд чтобы жетска хуесосить')
  .addStringOption(option => option.setName('userid').setDescription('1').setRequired(true)),


  async execute(interaction) {

    const roleId = '1179830414395854878';

    if (!interaction.member.roles.cache.has(roleId)) {
        return interaction.reply({content: 'У вас нет прав для использования этой команды.', ephemeral: true});
    }
		
      const userId = interaction.options.getString('userid');

     fs.readFile('./JSON/users.json', (err, content) => {
      if (err) throw err;
      const userIds = JSON.parse(content);

      if (!userIds.includes(userId)) {
        userIds.push(userId);

        fs.writeFile('./JSON/users.json', JSON.stringify(userIds, null, 2), (err) => {
          if (err) throw err;
          interaction.reply({content: `ID пользователя ${userId} успешно добавлен в список.`, ephemeral: true});
        });
      } else {
        interaction.reply({content: `ID пользователя ${userId} уже есть в списке.`, ephemeral: true});
      }
      });

  },

};
