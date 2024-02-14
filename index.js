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

client.on('messageCreate', (message) => {
  // Замените 'ID_канала' на ID канала, с которого вы хотите сохранять сообщения
  if (message.channel.id === '1201884376682737684') {

    if (message.author.bot)
    return;

  // Проверьте, содержит ли сообщение упоминания пользователей или ролей
  if (message.mentions.users.size > 0 || message.mentions.roles.size > 0)
  return;


    const data = {
      content: message.content,
      author: message.author.username,
      timestamp: message.createdTimestamp,
      attachments: message.attachments.map(attachment => attachment.url),
    };

    fs.readFile('messages.json', (err, content) => {
      if (err) throw err;
      const jsonContent = JSON.parse(content);
      jsonContent.messages.push(data);

      fs.writeFile('messages.json', JSON.stringify(jsonContent, null, 2), (err) => {
        if (err) throw err;
        console.log('Сообщение сохранено!');
      });
    });
  }
});
    
let messageCount = 0;
client.on('messageCreate', async (message) => {
  // Замените 'ID_канала' на ID канала, с которого вы хотите отправлять случайные сообщения
  if (message.channel.id === '1201884376682737684') {
    if (message.author.bot)
    return;

    messageCount++;

    if (messageCount >= 60) {
      messageCount = 0;

     fs.readFile('messages.json', (err, content) => {
      if (err) throw err;
      const jsonContent = JSON.parse(content);
      const messages = jsonContent.messages;

      // Выберите случайное сообщение
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      if (randomMessage.content && randomMessage.content.trim() !== '') {
        message.channel.send(randomMessage.content);
      }
      
      // Если есть вложения, отправьте их URL
       if (randomMessage.attachments && randomMessage.attachments.length > 0) {
        randomMessage.attachments.forEach((attachmentUrl) => {
          message.channel.send(attachmentUrl);
        });
      }
      
     });
    }
  }
});


let interval;


client.on(Events.InteractionCreate, async (interaction) => {
  const member = interaction.member;
const allowedRoles = ["1179830414395854878"]
if (!member.roles.cache.has(allowedRoles)) {



	if (interaction.commandName === 'удалить-из-дб') {
		const user = interaction.options.getUser('user');
		const quantity = interaction.options.getInteger('count');

		fs.readFile('messages.json', (err, content) => {
			if (err) throw err;
			let jsonContent = JSON.parse(content);
			let messages = jsonContent.messages;

			// Реверсивное изменение порядка сообщений
			messages = messages.reverse();

			let deletedCount = 0;

			// Фильтруем сообщения, оставляя только те, которые не от выбранного пользователя
			messages = messages.filter(msg => {
				if (msg.author === user.username && deletedCount < quantity) {
					deletedCount++;
					return false;
				}
				return true;
			});

			// Возвращаем сообщения в исходный порядок
			messages = messages.reverse();

			jsonContent.messages = messages;

			fs.writeFile('messages.json', JSON.stringify(jsonContent, null, 2), (err) => {
				if (err) throw err;
				console.log(`Удалено ${deletedCount} сообщений пользователя ${user.username}!`);
			});
		});

		await interaction.reply(`Удалено ${quantity} сообщений пользователя ${user.username}!`);
	}
} else {
  return interaction.reply(`1`);
}
  

});
 
client.on(Events.InteractionCreate, async (interaction) => {

if (interaction.commandName === 'пиздец') {
  if (interaction.member.voice.channel) {
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    // Остановить предыдущий интервал, если он существует
    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      fs.readFile('messages.json', (err, content) => {
        if (err) throw err;
        const jsonContent = JSON.parse(content);
        const messages = jsonContent.messages;

        // Выберите случайное сообщение
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        if (randomMessage.content && randomMessage.content.trim() !== '') {
          // Создание URL для TTS
          const url = googleTTS.getAudioUrl(randomMessage.content, {
            lang: 'ru',
            slow: false,
            host: 'https://translate.google.com',
          });

          // Создание аудиоресурса и воспроизведение его
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
  // Если пользователь вышел из голосового канала
  if (oldState.channelId && !newState.channelId) {
    // Получить голосовой канал, из которого вышел пользователь
    const channel = oldState.channel;

    // Проверить, остались ли в канале другие участники
    if (channel.members.size === 0) {
      // Если в канале больше нет участников, остановить интервал и отключиться
      if (interval) clearInterval(interval);
      const connection = getVoiceConnection(oldState.guild.id);
      if (connection) connection.destroy();
    }
  }
});

