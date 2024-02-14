const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('пиздец')
		.setDescription('Удалить сообщения пользователя'),
		
	async execute(interaction) {


		
		
	},
};
