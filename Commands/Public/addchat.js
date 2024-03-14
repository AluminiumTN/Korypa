const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addchat')
        .setDescription('Add chat to store data from channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addStringOption(option => option.setName('channel').setDescription('Channel id').setRequired(true)),

    async execute(interaction) {
        const channelId = interaction.options.getString('channel');
        const serverId = interaction.guild.name;
        const dir = `./JSON/${serverId}/channels`;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, `channels.json`);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.writeFile(filePath, JSON.stringify({ channels: [channelId] }, null, 2), (err) => {
                        if (err) throw err;
                      
                    });
                } else {
                    throw err;
                }
            } else {
                const jsonContent = JSON.parse(content);
                jsonContent.channels.push(channelId);

                fs.writeFile(filePath, JSON.stringify(jsonContent, null, 2), (err) => {
                    if (err) throw err;
           
                });
            }
        });

        // Создание папки messages и JSON файла с именем канала
        const messagesDir = `./JSON/${serverId}/messages`;
        if (!fs.existsSync(messagesDir)){
            fs.mkdirSync(messagesDir, { recursive: true });
        }

        const messagesFilePath = path.join(messagesDir, `${channelId}.json`);
        fs.writeFile(messagesFilePath, JSON.stringify({ messages: [] }, null, 2), (err) => {
            if (err) throw err;
 
        });

        await interaction.reply(`Канал ${channelId} добавлен в базу данных.`);
    }
}