
    const fs = require('fs');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {


        const serverId = message.guild.name;
     const channelId = message.channel.id;
    const path = `./JSON/${serverId}/messages/${channelId}.json`;

  fs.exists(`./JSON/${serverId}`, (exists) => {
    if (!exists) {
      console.log(`Папка для сервера ${serverId} не найдена.`);
      return;
    }

    fs.readFile(path, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return;
        } else {
          throw err;
        }
      }

      if (message.author.bot) return;
      if (message.mentions.users.size > 0 || message.mentions.roles.size > 0) return;

      const data = {
        content: message.content,
        author: message.author.username,
        timestamp: message.createdTimestamp,
        attachments: message.attachments.map(attachment => attachment.url),
      };

      let jsonContent;

      if (content.length === 0) {
        jsonContent = { "messages": [] };
      } else {
        jsonContent = JSON.parse(content);
      }

      jsonContent.messages.push(data);


      while (jsonContent.messages.length > 1000) {
        jsonContent.messages.shift();
      }

      fs.writeFile(path, JSON.stringify(jsonContent, null, 2), (err) => {
        if (err) throw err;
   
      });
    });
  });
 
    }
}
