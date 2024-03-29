/**
 * dank memer ripoff
 */
/** packages */
const fs = require('fs');
const mong = require('mongoose');
/** config n util n models */
const config = require('./src/data/config.json');
const util = require('./src/data/util.js');
/** database */
mong.connect(`mongodb://${config.mongodb.user}:${config.mongodb.pwd}@localhost:27017/memer`, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('connected db'));
/** actual bot login things etc */
const discord = require('discord.js-light');
const memer = new discord.Client({
    cacheGuilds: true,
    cacheChannels: true,
    cacheEmojis: true,
    fetchAllMembers: true,
    messageSweepInterval: 10,
    messageCacheLifetime: 10,
    messageCacheMaxSize: 0,
    disableMentions: 'everyone',
    ws: {
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_EMOJIS']
    },
    presence: {
        activity: {
            name: 'pls help'
        }
    },
    disabledEvents: [
        'GUILD_INTEGRATIONS_UPDATE',
        'GUILD_ROLE_CREATE',
        'GUILD_ROLE_DELETE',
        'GUILD_ROLE_UPDATE',
        'GUILD_EMOJIS_UPDATE',
        'CHANNEL_DELETE',
        'CHANNEL_PINS_UPDATE',
        'MESSAGE_DELETE',
        'MESSAGE_UPDATE',
        'MESSAGE_DELETE_BULK',
        'MESSAGE_BULK_DELETE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'TYPING_START',
        'TYPING_STOP',
        'VOICE_BROADCAST_SUBSCRIBE',
        'VOICE_BROADCAST_UNSUBSCRIBE',
        'VOICE_SERVER_UPDATE'
    ]
});
memer.login(config.token);
/** commands */
memer.commands = new discord.Collection();
/** config */
memer.config = config;
/** load cmds */
const commandsInDir = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandsInDir) {
    const command = require(`./src/commands/${file}`);
    memer.commands.set(command.name, command);
}
/** bot events */
memer.once('ready', () => {
    console.log('dank memer ripoff is ready');
    /** clear old command cooldowns */
    setInterval(async () => {
        await util.delCDs();
    }, 1000);
});
memer.on('message', async message => {
    if (message.author.bot || message.channel.type !== 'text') return;

    let prefix;
    for (let p of config.prefixes) {
        if (p.includes('botid')) p = p.replace('botid', memer.user.id);
        if (message.content.toLowerCase().startsWith(p)) {
            prefix = p;
            break;
        }
    }
    if (prefix === undefined) return;

    /** check db */
    await util.getDBUser(message.author.id);
    /** add pls */
    await util.updateDBUser(message.author.id, {
        pls: 1
    });

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    const cmd = memer.commands.get(cmdName) || memer.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
    if (!cmd) return;

    const hasCooldown = await util.hasCD(message.author.id, cmd.name);
    if (hasCooldown) {
        const cooldown = await util.getCD(message.author.id, cmd.name);
        let timeLeft = (cooldown.cooldown - Date.now()) / 1000;
        if (timeLeft < 1) timeLeft = 1;
        const e = new discord.MessageEmbed()
            .setTitle('Slow it down, cmon')
            .setDescription(`${(cooldown.message==='')?'Try again in':cooldown.message} ${(timeLeft > 60 ? `**${util.parseTime(timeLeft)}**` : `**${timeLeft.toFixed()} seconds**`)}\n\n` +
                `__Default Cooldown__: ${util.parseTime(cooldown.defaultCD/1000)}\n\n` +
                'While you wait, go check out our [Twitter](https://twitter.com/dankmemerbot), [Subreddit](https://www.reddit.com/r/dankmemer/), and [Discord Server](https://www.discord.gg/Wejhbd4)')
            .setColor('#3f51b5');
        return message.channel.send(e).catch(() => {});
    } else {
        try {
            cmd.execute(memer, message, args);
        } catch (e) {
            console.log(e.stack);
        }
    }

});

/** catch dem errors */
process.on('uncaughtException', exception => {
    console.error(exception);
});
process.on('unhandledRejection', rejection => {
    console.error(rejection);
});