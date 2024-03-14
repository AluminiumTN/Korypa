const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-user-msg')
		.setDescription('Dlete user messages from database')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(option => option.setName('user').setDescription('Choose user').setRequired(true))
		.addIntegerOption(option => option.setName('count').setDescription('Choose count of messages').setRequired(true)),
	async execute(interaction) {

				const user = interaction.options.getUser('user');
				const quantity = interaction.options.getInteger('count');
				const serverId = interaction.guild.name;
				const channelId = interaction.channel.id;
				const path = `./JSON/${serverId}/messages/${channelId}.json`;
		
				fs.readFile(path, (err, content) => {
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
		
					fs.writeFile(path, JSON.stringify(jsonContent, null, 2), (err) => {
						if (err) throw err;
	
					});
				});
		
				await interaction.reply({content: `Deleted ${quantity} from user ${user.username}!`, ephemeral: true});
			}
}
