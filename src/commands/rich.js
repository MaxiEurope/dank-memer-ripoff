const discord = require('discord.js-light');
const models = require('../data/models.js');
const util = require('../data/util.js');

module.exports = {
    name: 'rich',
    aliases: ['richest', 'toponepercent'],
    async execute(memer, message) {

        await util.addCD(message.author.id, this.name);

        const emojis = [':first_place:', ':second_place:', ':third_place:'];

        const res = await models.user.find().sort({
            pocket: -1
        }).limit(10);

        let pls = [];

        for (let i = 0; i < res.length; i++) {
            const user = await util.getUser(memer, res[i].userID);
            pls.push(`${emojis[i] || '👏'} ${res[i].pocket.toLocaleString()} - ${user ? user.tag:'LOL WHO DIS'}`);
        }

        const e = new discord.MessageEmbed()
            .setTitle('Top 10 Global Richest Users')
            .setDescription(pls.join('\n'))
            .setFooter('Global Leaderboard')
            .setColor(util.randomColor());
        message.channel.send(e).catch(() => {});

    },
};