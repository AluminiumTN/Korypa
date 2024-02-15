const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('удалить-из-дб')
		.setDescription('Удалить сообщения пользователя')
		.addUserOption(option => option.setName('user').setDescription('Выберите пользователя').setRequired(true))
		.addIntegerOption(option => option.setName('count').setDescription('Введите количество сообщений для удаления').setRequired(true)),
	async execute(interaction) {

		const roleId = '1179830414395854878';

		if (!interaction.member.roles.cache.has(roleId)) {
		  return interaction.reply({content: 'У вас нет прав для использования этой команды.', ephemeral: true});
		}
		
		
		
			if (interaction.commandName === 'удалить-из-дб') {
				const user = interaction.options.getUser('user');
				const quantity = interaction.options.getInteger('count');
		
				fs.readFile('./JSON/messages.json', (err, content) => {
					if (err) throw err;
					let jsonContent = JSON.parse(content);
					let messages = jsonContent.messages;
		
					messages = messages.reverse();
		
					let deletedCount = 0;
		
					messages = messages.filter(msg => {
						if (msg.author === user.username && deletedCount < quantity) {
							deletedCount++;
							return false;
						}
						return true;
					});
		
					messages = messages.reverse();
		
					jsonContent.messages = messages;
		
					fs.writeFile('./JSON/messages.json', JSON.stringify(jsonContent, null, 2), (err) => {
						if (err) throw err;
						console.log(`Удалено ${deletedCount} сообщений пользователя ${user.username}!`);
					});
				});
		
				await interaction.reply({content: `Удалено ${quantity} сообщений пользователя ${user.username}!`, ephemeral: true});
			}

		  
		}	
}
