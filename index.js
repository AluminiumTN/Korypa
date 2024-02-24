const { Events, ChannelType, EmbedBuilder, ActionRowBuilder,  ModalBuilder,
  TextInputBuilder, 
  TextInputStyle,  ButtonBuilder, ButtonStyle, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');

const { Client, GatewayIntentBits, Partials, Collection } = require(`discord.js`);

const {Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, MessageContent, GuildModeration} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel } = Partials;


const {loadEvents} = require(`./Handlers/eventHandler`);
const {loadCommands} = require(`./Handlers/commandHandler`);


const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, MessageContent, GuildModeration],
  partials: [User, Message, GuildMember, ThreadMember, Channel,],
});

const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client); // discord-modals needs your client in order to interact with modals

client.commands = new Collection();
client.voiceGenerator = new Collection();

require(`discord-modals`)(client)
client.config = require(`./config.json`);

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});

client.on("interactionCreate", (interaction) => {
    if(!interaction.isChatInputCommand()) return
 
        const command = client.commands.get(interaction.commandName)
 
        if(!command) {
            interaction.reply({ content: "there isn't a command like that" })
        }
 
        command.execute(interaction, client)
});



const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const player = createAudioPlayer();
const googleTTS = require('google-tts-api');
const path = require('path');


// сохраняет сообщения
client.on('messageCreate', (message) => {
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
});





// функция для хуесоса людей

client.on('messageCreate', async (message) => {

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
});


// функа для случайных сообщения из бд
    
let messageCount = 0;
client.on('messageCreate', async (message) => {
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

  if (messageCount >= 5) {
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
});


// хуйни в войс чате

let interval;

client.on(Events.InteractionCreate, async (interaction) => {

if (interaction.commandName === 'пиздец') {
  if (interaction.member.voice.channel) {
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });


    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      fs.readFile('./JSON/messages.json', (err, content) => {
        if (err) throw err;
        const jsonContent = JSON.parse(content);
        const messages = jsonContent.messages;

       
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        if (randomMessage.content && randomMessage.content.trim() !== '') {
        
          const url = googleTTS.getAudioUrl(randomMessage.content, {
            lang: 'ru',
            slow: false,
            host: 'https://translate.google.com',
          });

      
          const resource = createAudioResource(url, {
            inputType: StreamType.Arbitrary,
          });
          player.play(resource);
          connection.subscribe(player);
        }
      });
    }, 30000); // Каждые 30 сек
  } else {
  return interaction.reply({ content: 'Вы должны быть в голосовом канале, чтобы использовать эту команду!', ephemeral: true});
  }
}

});



client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelId && !newState.channelId) {
    const channel = oldState.channel;

    if (channel.members.size === 0) {
      if (interval) clearInterval(interval);
      const connection = getVoiceConnection(oldState.guild.id);
      if (connection) connection.destroy();
    }
  }
});


// рандом реакции

client.on('messageCreate', async message => {
  const serverId = message.guild.name;
  const path = `./JSON/${serverId}/emojis/emojis.json`;
  const channelsPath = `./JSON/${serverId}/channels/channels.json`;

  try {
    let reactions;
    if (fs.existsSync(path)) {
      reactions = JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    let channels;
    if (fs.existsSync(channelsPath)) {
      channels = JSON.parse(fs.readFileSync(channelsPath, 'utf8')).channels;
    }

    const reactionProbability = 0.2;

    if (reactions && Math.random() <= reactionProbability && channels.includes(message.channel.id)) {
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];

      await message.react(reaction);

    }
  } catch (error) {

  }
});


const Canvas = require('canvas');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const sharp = require('sharp');


client.on('messageCreate', async message => {
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

  if (messageCount % 3 === 0) {
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
      ctx.fillText(msg.content.split('\n')[0], canvas.width /2 -ctx.measureText(msg.content.split('\n')[0]).width /2 ,700); // Centered text

      const attachment= new Discord.AttachmentBuilder(canvas.toBuffer(), 'modifiedImage.png');

    
      await message.channel.send({ files: [attachment] });
   }

});