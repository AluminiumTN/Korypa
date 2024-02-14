const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('удалить-из-дб')
		.setDescription('Удалить сообщения пользователя')
		.addUserOption(option => option.setName('user').setDescription('Выберите пользователя').setRequired(true))
		.addIntegerOption(option => option.setName('count').setDescription('Введите количество сообщений для удаления').setRequired(true)),
	async execute(interaction) {


		
		
	},
};
