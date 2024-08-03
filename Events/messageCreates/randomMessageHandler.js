let messageCount = 0;

const fs = require('fs');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const serverId = message.guild.name;
        const channelId = message.channel.id;
        const path = `./JSON/${serverId}/messages/${channelId}.json`;
      
        fs.readFile(path, (err, content) => {
          if (err) {
            if (err.code === 'ENOENT') {
       
              return;
            } else {
              throw err;
            }
          }
      
        if (message.author.bot)
          return;
      
        messageCount++;
      
        if (messageCount >= 40) {
          messageCount = 0;
      
          fs.readFile(path, (err, content) => {
            if (err) throw err;
            let jsonContent;
            try {
              jsonContent = JSON.parse(content);
            } catch (error) {
      
              return;
            }
            const messages = jsonContent.messages;
      
            if (messages) {
              const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
              if (randomMessage.content && randomMessage.content.trim() !== '') {
                message.channel.send(randomMessage.content);
              }
      
              if (randomMessage.attachments && randomMessage.attachments.length > 0) {
                randomMessage.attachments.forEach((attachmentUrl) => {
                  message.channel.send(attachmentUrl);
                });
              }
            }
          });
        }
      });
    

       
    }
}
