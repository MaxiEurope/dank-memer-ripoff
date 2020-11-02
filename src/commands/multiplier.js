const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'multiplier',
    aliases: ['multi'],
    async execute(memer, message) {

        await util.addCD(message.author.id, this.name);

        const {
            total,
            text,
            unlocked
        } = await util.calcMulti(message);

        const e = new discord.MessageEmbed()
            .setTitle(`Here is some info about your Multipliers, ${message.author.username}`)
            .setDescription(`**Current Total Multiplier**: ${total}%\n**Activated Multipliers**: *See below*`)
            .addField(`${unlocked} Unlocked`, `${text}`)
            .setColor(util.randomColor());
        message.channel.send(e).catch(() => {});

    },
};