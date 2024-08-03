const fs = require('fs');
const Canvas = require('canvas');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const sharp = require('sharp');
let messageCount = 0;

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lines = [];

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth) {
            lines.push(line);
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }

    lines.push(line);

    for (let j = 0; j < lines.length; j++) {
        ctx.fillText(lines[j], x, y + (j * lineHeight));
    }
}

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {

        const serverId = message.guild.name;
        const channelId = message.channel.id;

        if (!fs.existsSync(`./JSON/${serverId}`)) {
            return;
        }

        let channelData = JSON.parse(fs.readFileSync(`./JSON/${serverId}/channels/channels.json`, 'utf-8'));

        if (!channelData.channels.includes(channelId)) return;

        let data;
        try {
            data = JSON.parse(fs.readFileSync(`./JSON/${serverId}/messages/${channelId}.json`, 'utf-8'));
        } catch (error) {
            console.error('Error reading JSON file:', error);
            return;
        }

        if (!data || !data.messages || data.messages.length === 0) {
            return;
        }

        if (message.author.bot) return;

        messageCount++;

        if (messageCount % 5 === 0) {
            const hasAttachment = data.messages.some(msg => msg.attachments && msg.attachments.length > 0);
            if (!hasAttachment) {
                return;
            }

            let msg;
            let validMessageFound = false;

            for (let attempt = 0; attempt < 10; attempt++) {
                msg = data.messages[Math.floor(Math.random() * data.messages.length)];

                if (msg.content.length <= 60) {
                    validMessageFound = true;
                    break;
                }
            }

            if (!validMessageFound) {
                console.log('No valid message found within the character limit');
                return;
            }

            let randomMessage = data.messages[Math.floor(Math.random() * data.messages.length)];

            while (!randomMessage.attachments || !randomMessage.attachments[0] || randomMessage.attachments[0].match(/.(mp3|ogg|mp4)$/i)) {
                randomMessage = data.messages[Math.floor(Math.random() * data.messages.length)];
            }

            const baseImg = await Canvas.loadImage('./assets/jack.jpg');

            const canvas = Canvas.createCanvas(baseImg.width, baseImg.height);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

            ctx.font = '30px Times New Roman';
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            const messageText = msg.content.split('\n')[0];
            const maxWidth = canvas.width - 300; 
            const lineHeight = 30; 
            wrapText(ctx, messageText, canvas.width / 2- 100, 100, maxWidth, lineHeight);


            ctx.font = '20px Times New Roman';
            ctx.fillStyle = '#000000';
            const authorText = `— ${randomMessage.author} —`;
            ctx.fillText(authorText, canvas.width / 2 - 120, canvas.height - 50);

            const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), 'modifiedImage.png');

            await message.channel.send({ files: [attachment] });
        }
    }
}