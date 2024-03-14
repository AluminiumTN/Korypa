const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('пиздец')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDescription('призвать бота в войс'),
		
	async execute(interaction) {


		
		
	},
};
