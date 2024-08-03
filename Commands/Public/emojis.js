const fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addemoji')
        .setDescription('Add emoji to JSON file')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addStringOption(option => option.setName('emoji').setDescription('Emoji').setRequired(true)),

    async execute(interaction) {
        const emoji = interaction.options.getString('emoji');
        const serverId = interaction.guild.name;
        const dir = `./JSON/${serverId}/emojis`;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, `emojis.json`);

        let jsonContent;
        try {
            const content = fs.readFileSync(filePath);
            jsonContent = JSON.parse(content);
        } catch (err) {
            if (err.code === 'ENOENT') {
                jsonContent = [];
            } else {
                throw err;
            }
        }

        jsonContent.push(emoji);

        fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));


    }
}
