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



// сохраняет сообщения
client.on('messageCreate', (message) => {
  if (message.channel.id === '1201884376682737684') {

    if (message.author.bot)
    return;

  if (message.mentions.users.size > 0 || message.mentions.roles.size > 0)
  return;


    const data = {
      content: message.content,
      author: message.author.username,
      timestamp: message.createdTimestamp,
      attachments: message.attachments.map(attachment => attachment.url),
    };

    fs.readFile('./JSON/messages.json', (err, content) => {
      if (err) throw err;
      const jsonContent = JSON.parse(content);
      
      // Удаляем первое сообщение в массиве
      if (jsonContent.messages.length > 0) {
        jsonContent.messages.shift();
      }

      jsonContent.messages.push(data);

      fs.writeFile('./JSON/messages.json', JSON.stringify(jsonContent, null, 2), (err) => {
        if (err) throw err;
        console.log('Сообщение сохранено!');
      });
    });
  }
});



// функция для хуесоса людей

client.on('messageCreate', async (message) => {
  if (message.channel.id === '1201884376682737684') {
    if (message.author.bot)
    return;
// id бота корочи и в ppls.json людей которых хуесосить
    if (message.mentions.has('1190628066859421706') ) {

      fs.readFile('./JSON/users.json', (err, content) => {
        if (err) throw err;
        const userIds = JSON.parse(content);

        if (userIds.includes(message.author.id)) {

       fs.readFile('./JSON/messages.json', (err, content) => {
        if (err) throw err;
        const jsonContent = JSON.parse(content);
        const messages = jsonContent.messages;

        fs.readFile('./JSON/badwords.json', (err, badWordsContent) => {
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
  }
  }
  
});


// функа для случайных сообщения из бд
    
let messageCount = 0;
client.on('messageCreate', async (message) => {
  if (message.channel.id === '1201884376682737684') {
    if (message.author.bot)
    return;

    messageCount++;

    if (messageCount >= 60) {
      messageCount = 0;

     fs.readFile('./JSON/messages.json', (err, content) => {
      if (err) throw err;
      const jsonContent = JSON.parse(content);
      const messages = jsonContent.messages;

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      if (randomMessage.content && randomMessage.content.trim() !== '') {
        message.channel.send(randomMessage.content);
      }
      

       if (randomMessage.attachments && randomMessage.attachments.length > 0) {
        randomMessage.attachments.forEach((attachmentUrl) => {
          message.channel.send(attachmentUrl);
        });
      }
      
     });
    }
  }
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
  if (message.channel.id === '1201884376682737684') {
  try {
      // Список реакций, которые бот может использовать
      const reactions = ['☠️', '😱', '😈', '💀', '😭', '🙏', '🗣️', ':mamkanasinga~2:', '😡', '🔥', '🕯️', '🦼', '🏚️', '🦆', '🪵', '🐘', '🇿', '🇻', '🇴', '🥶', '😨', '👹', '🤨', '📜'];

      // Вероятность реакции (например, 10%)
      const reactionProbability = 0.2;

      // Если случайное число меньше или равно вероятности реакции, бот добавляет реакцию
      if (Math.random() <= reactionProbability) {
          // Выбрать случайную реакцию из списка
          const reaction = reactions[Math.floor(Math.random() * reactions.length)];

          // Добавить реакцию к сообщению
          await message.react(reaction);
          console.log(`Бот добавил реакцию '${reaction}' к сообщению.`);
      }
  } catch (error) {
      console.error(`Не удалось добавить реакцию к сообщению.`, error);
  }
}
});


client.on('messageCreate', message => {

  let extension = message.attachments.first() ? message.attachments.first().name.split('.').pop() : '';
  let forbiddenExtensions = ['zip', 'rar', '7z', 'gz', 'bz2', 'exe', 'msi', 'iso', 'img', 'dmg', 'vhd'];


  let allowedRole = ['1179830414395854878', '1191282269483192401'];

  if (forbiddenExtensions.includes(extension)) {
  
    if (!message.member.roles.cache.some(role => allowedRole.includes(role.id))) {
      message.delete();
      message.author.send('sosi penis loshara');
    }
  }
});

const Canvas = require('canvas');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const sharp = require('sharp');
let data = JSON.parse(fs.readFileSync('./JSON/messages.json', 'utf-8'));

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  messageCount++;
 if (message.channel.id === '1201884376682737684') {
  if (messageCount % 60 === 0) {
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
  }
});
