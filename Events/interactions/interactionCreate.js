const {PermissionFlagsBits, EmbedBuilder} = require('discord.js');



module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const {member, guildId, customId, message} = interaction;

        if(!interaction.isButton()) return;

        const embedd = new EmbedBuilder()
        .setColor('#ff69b4')

        if (customId == 'suggest-accept' || customId == 'suggest-decline') {
            if (!member.permissions.has(PermissionFlagsBits.Administrator))

                return interaction.reply({embeds: [embedd.setDescription('У вас нет разрешения на использование этой кнопки!')], ephemeral: true})

                SuggestionSchema.findOne({GuildId: guildId, MessageId: message.id}, async(err, data) => {
                    if (err) throw err;

                    if (!data)
                        return interaction.reply({embeds: [embedd.setDescription('Данные не найдены, обращайтесь к `Aluminium_#6666`!')], ephemeral: true})

                    const embed = message.embeds[0];

                    if (!embed)
                        return interaction.reply({embeds: [embedd.setDescription('Вставка не найдена, свяжитесь с `Aluminium_#6666`!')], ephemeral: true})

                    switch (customId) {
                        case 'suggest-accept':
                            embed.data.fields[1] = {name: 'Статус:', value: 'Принято!'}
                            const AcceptedEmbed = EmbedBuilder.from(embed);

                            message.edit({embeds: [AcceptedEmbed]});
                            interaction.reply({embeds: [embedd.setDescription('Предложение принято!')], ephemeral: true})
                            break;
                        case 'suggest-decline':
                            embed.data.fields[1] = {name: 'Статус:', value: 'Отклонено!'}
                            const DeclinedEmbed = EmbedBuilder.from(embed);

                            message.edit({embeds: [DeclinedEmbed]});
                            interaction.reply({embeds: [embedd.setDescription('Предложение отклонено!')], ephemeral: true})
                    }
                })
        }

       
    }
}
