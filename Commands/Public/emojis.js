const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addemoji')
        .setDescription('Add emoji to JSON file')
        .addStringOption(option => option.setName('emoji').setDescription('Emoji').setRequired(true)),

    async execute(interaction) {
        const emoji = interaction.options.getString('emoji');
        const serverId = interaction.guild.name;
        const dir = `./JSON/${serverId}/emojis`;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, `emojis.json`);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.writeFile(filePath, JSON.stringify([emoji], null, 2), (err) => {
                        if (err) throw err;
                    });
                } else {
                    throw err;
                }
            } else {
                const jsonContent = JSON.parse(content);
                jsonContent.emojis.push(emoji);

                fs.writeFile(filePath, JSON.stringify(jsonContent, null, 2), (err) => {
                    if (err) throw err;
                });
            }
        });

        await interaction.reply(`Эмоджи ${emoji} добавлен в базу данных.`);
    }
}
