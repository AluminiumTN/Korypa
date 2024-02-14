const {Client} = require('discord.js')
const mongoose = require('mongoose')
const config = require('../../config.json')

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect(config.mongodb)

            if (mongoose.connect) {
                console.log('База данных MongoDB подключена.')
            }

            console.log(`${client.user.username} онлайн.`)
        }
        catch (error) {
            console.log(`Ошибка ${error}`)
        }
    },
};