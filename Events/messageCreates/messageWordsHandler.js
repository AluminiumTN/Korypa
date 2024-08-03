

const fs = require('fs');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {


        if (message.author.bot)
            return;
        
          if (message.mentions.has('1190628066859421706')) {
        
            const serverId = message.guild.name;
            const channelId = message.channel.id;
        
            const usersPath = `./JSON/${serverId}/users.json`;
            const messagesPath = `./JSON/${serverId}/messages/${channelId}.json`;
            const badWordsPath = `./JSON/${serverId}/badwords.json`;
        
            if (!fs.existsSync(usersPath) || !fs.existsSync(badWordsPath)) {
        
              return;
            }
        
            fs.readFile(messagesPath, (err, content) => {
              if (err) {
                if (err.code === 'ENOENT') {
                  return;
                } else {
                  throw err;
                }
              }
        
              fs.readFile(usersPath, (err, content) => {
                if (err) throw err;
                const userIds = JSON.parse(content);
        
                if (userIds.includes(message.author.id)) {
                  fs.readFile(messagesPath, (err, content) => {
                    if (err) throw err;
                    const jsonContent = JSON.parse(content);
                    const messages = jsonContent.messages;
        
                    fs.readFile(badWordsPath, (err, badWordsContent) => {
                      if (err) throw err;
                      const badWords = JSON.parse(badWordsContent);
        
                      const badMessages = messages.filter(message => badWords.some(badWord => message.content.includes(badWord)));
                      const randomMessage = badMessages[Math.floor(Math.random() * badMessages.length)];
        
                      if (randomMessage.content && randomMessage.content.trim() !== '') {
                        message.channel.send(randomMessage.content);
                      }
        
                      if (randomMessage.attachments && randomMessage.attachments.length > 0) {
                        randomMessage.attachments.forEach((attachmentUrl) => {
                          message.channel.send(attachmentUrl);
                        });
                      }
                    });
                  });
                }
              });
            });
          }
    

       
    }
}
