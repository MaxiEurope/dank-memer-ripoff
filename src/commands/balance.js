const config = require('../data/config.json');
const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'bal',
    aliases: ['balance', 'coins'],
    async execute(memer, message, args) {

        await util.addCD(message.author.id, this.name);

        const user = util.getUser(memer, args[0]);

        if (!user) {
            const {
                bank,
                pocket
            } = await util.getDBUser(message.author.id);
            const e = new discord.MessageEmbed()
                .setTitle(`Here is your balance, ${message.author.username}`)
                .setDescription(`**Your Pocket**: ${pocket.toLocaleString()} coins\n**Bank Account**: ${bank.toLocaleString()} coins`)
                .setThumbnail(config.coin)
                .setColor(util.randomColor());
            message.channel.send(e).catch(() => {});
        } else {
            const {
                bank,
                pocket
            } = await util.getDBUser(user.id, {
                create: false
            });
            const e = new discord.MessageEmbed()
                .setTitle(`Here is ${user.username}'s balance`)
                .setDescription(`**Their Pocket**: ${pocket.toLocaleString()} coins.\n**Bank Account**: ${bank.toLocaleString()} coins`)
                .setThumbnail(config.coin)
                .setColor(util.randomColor());
            message.channel.send(e).catch(() => {});
        }

    },
};