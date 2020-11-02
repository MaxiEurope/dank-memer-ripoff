const config = require('../data/config.json');
const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'daily',
    async execute(memer, message) {

        await util.addCD(message.author.id, this.name, {
            cd: 86400000,
            msg: 'I\'m not made of money dude, wait'
        });

        const {
            streak
        } = await util.getDBUser(message.author.id);
        let tmpStr = streak.streak;
        /** 2 days passed */
        if (Date.now() - streak.time > 172800000) {
            await util.updateDBUser(message.author.id, {
                streak: {
                    streak: 1,
                    time: Date.now()
                }
            });
            tmpStr = 1;
        } else {
            await util.updateDBUser(message.author.id, {
                streak: {
                    streak: streak.streak + 1,
                    time: Date.now()
                }
            });
            tmpStr += 1;
        }
        let coinsEarned = 250;
        const streakBonus = Math.round((0.02 * coinsEarned) * tmpStr);
        if (tmpStr > 1) {
            coinsEarned = coinsEarned + streakBonus;
        }
        await util.updateDBUser(message.author.id, {
            pocket: coinsEarned
        });
        const e = new discord.MessageEmbed()
            .setTitle(`Here are your daily coins, ${message.author.username}`)
            .setDescription(`**${coinsEarned.toLocaleString()} coins** were placed in your pocket.\n\nYou can get another 250 coins by voting! ([Click Here](https://discordbots.org/bot/memes/vote) and [here](https://discordbotlist.com/bots/270904126974590976))`)
            .setThumbnail(config.coin)
            .setFooter(`Streak: ${tmpStr} days (+${streakBonus.toLocaleString()} coins)`)
            .setColor(util.randomColor());
        message.channel.send(e).catch(() => {});

    },
};