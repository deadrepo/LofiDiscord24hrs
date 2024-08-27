const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const sodium = require('libsodium-wrappers');
const { generateDependencyReport } = require('@discordjs/voice');
const { Readable } = require('stream');

console.log(generateDependencyReport());

const TOKEN = '';
const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const VOICE_CHANNEL_ID = '';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log('Bot is online!');
    playMusic();
});

async function playMusic() {
    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);

    if (!channel || channel.type !== 'GUILD_VOICE') {
        console.error('The specified channel ID is not a voice channel!');
        return;
    }

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('The bot has connected to the channel!');
        const stream = ytdl(YOUTUBE_LINK, { filter: 'audioonly', quality: 'highestaudio' });
        const resource = createAudioResource(Readable.fromWeb(stream));
        const player = createAudioPlayer();

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('The bot started playing the music!');
        });

        player.on('error', error => {
            console.error('Error playing audio:', error);
        });
    });

    connection.on('error', error => {
        console.error('Error connecting to the voice channel:', error);
    });
}

client.login(TOKEN);
