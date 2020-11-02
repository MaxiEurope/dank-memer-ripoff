const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'search',
    aliases: ['dumpsterdive'],
    async execute(memer, message) {

        await util.addCD(message.author.id, this.name, {
            cd: 600000,
            msg: 'There is currently a homeless man eating from that dumpster, try again in'
        });

        let msg = '';
        const chances = util.randomNum(0, 25);

        if (chances === 0) {
            msg = 'Looks like you didn\'t find any coins in the dumpster. At least you found some day old tortillas!';
        } else {
            msg = `You found **${chances > 1 ? chances + ' coins' : chances + ' coin'}** in the dumpster!\nCongrats I think? Idk, all I know is that you smell bad now.`;
        }

        await util.updateDBUser(message.author.id, {
            pocket: chances
        });

        const e = new discord.MessageEmbed()
            .setTitle(`${message.author.username} searches in a dumpster for some coins...`)
            .setDescription(`${msg}`)
            .setColor(util.randomColor());
        message.channel.send(e).catch(() => {});

    },
};