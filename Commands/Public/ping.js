const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pinggg")
    .setDescription("Pong")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(interaction) {
        interaction.reply({content: "Pong", ephemeral: true})
    },
};