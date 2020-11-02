const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'redeem',
    aliases: ['balance', 'coins'],
    async execute(memer, message) {

        const {
            donor
        } = await util.getDBUser(message.author.id);

        if (donor === false) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('This command is for donors only. You can find more information on https://www.patreon.com/dankmemerbot if you are interested.').catch(() => {});
        }

        await util.addCD(message.author.id, this.name, {
            cd: 2592000000,
            msg: 'You have to wait'
        });

        const multiplier = 100; // lets say everyone donated $100
        const winnings = Number(multiplier) * 1000;

        await util.updateDBUser(message.author.id, {
            pocket: winnings
        });

        const e = new discord.MessageEmbed()
            .setTitle(`${message.author.username} has redeemed their monthly donor rewards!`)
            .setDescription(`You donated $${multiplier}, so you get ${winnings.toLocaleString()} coins!\nThank you for your support!`)
            .setColor(util.randomColor());
        message.channel.send(e).catch(() => {});

    },
};