const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'weekly',
    async execute(memer, message) {

        await util.addCD(message.author.id, this.name, {
            cd: 604800000,
            msg: 'I\'m not made of money dude, wait'
        });

        let coinsEarned = 1800;

        await util.updateDBUser(message.author.id, {
            pocket: coinsEarned
        });

        const e = new discord.MessageEmbed()
            .setTitle(`Here are your weekly coins, ${message.author.username}`)
            .setDescription(`**${coinsEarned.toLocaleString()} coins** were placed in your pocket.\n\nYou can get another 250 coins by voting! ([Click Here](https://discordbots.org/bot/memes/vote) and [here](https://discordbotlist.com/bots/270904126974590976))`)
            .setColor(util.randomColor());
        message.channel.send(e).catch(() => {});

    },
};