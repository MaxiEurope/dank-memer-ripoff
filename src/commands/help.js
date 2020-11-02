const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'help',
    aliases: ['commands'],
    async execute(memer, message) {

        await util.addCD(message.author.id, this.name);

        const e = new discord.MessageEmbed()
            .setTitle('💰 Currency Commands')
            .setDescription('`balance` `bank` `beg` `daily` `flip` `gamble` `multiplier` `rich` `search` `share` `steal` `weekly`\n\n' +
                '**[Premium Only](https://www.patreon.com/join/dankmemerbot)**\nredeem')
            .setFooter('use pls before each command!')
            .setColor(util.randomColor());
        message.channel.send(e).catch(() => {});

    },
};