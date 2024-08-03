const fs = require('fs');
const Canvas = require('canvas');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const sharp = require('sharp');
let messageCount = 0;
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
          const hasAttachment = data.messages.some(message => message.attachments && message.attachments.length > 0);
      
          if (!hasAttachment) {
              return;
          }
            let msg = data.messages[Math.floor(Math.random() * data.messages.length)];
            
      
      
            const baseImg = new Canvas.Image();
            baseImg.src = './assets/mamamia.jpg'; 
      
        
            const baseImgInfo = await sharp(baseImg.src).metadata();
      
           
            const canvas = Canvas.createCanvas(baseImgInfo.width, baseImgInfo.height);
            const ctx = canvas.getContext('2d');
      
         
            ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      
      
            let randomMessage = data.messages[Math.floor(Math.random() * data.messages.length)];
          
            while (!randomMessage.attachments || !randomMessage.attachments[0] || randomMessage.attachments[0].match(/.(mp3|ogg|mp4)$/i)) {
                randomMessage = data.messages[Math.floor(Math.random() * data.messages.length)];
            
            }
      
            const img = new Canvas.Image();
            try {
              const response = await fetch(randomMessage.attachments[0]);
              const buffer = await response.buffer();
              img.src = buffer;
      
              ctx.drawImage(img, 57, 52, 568, 548); 
            } catch (error) {
              console.error('Error loading image:', error);
              return; 
            }
      
            ctx.font ='50px Times New Roman';
            ctx.fillStyle ='#ffffff';
            ctx.fillText(msg.content.split('\n')[0], canvas.width /2 -ctx.measureText(msg.content.split('\n')[0]).width /2 ,700); 
      
            const attachment= new Discord.AttachmentBuilder(canvas.toBuffer(), 'modifiedImage.png');
      
          
            await message.channel.send({ files: [attachment] });
         }
      

    }
}