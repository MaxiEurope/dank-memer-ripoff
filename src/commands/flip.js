const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'flip',
    aliases: ['coinflip'],
    async execute(memer, message) {

        const {
            pocket
        } = await util.getDBUser(message.author.id);

        if (pocket === 0) {
            await util.addCD(message.author.id, this.name);
            const e = new discord.MessageEmbed()
                .setTitle('You have no coins.')
                .setColor(util.randomColor());
            return message.channel.send(e).catch(() => {});
        }

        const coinFlip = util.randomNum(1, 2);
        const heads = 1;
        const tails = 2;

        message.channel.send('Call `heads` or `tails`\nYou have about 10 seconds before I give up.').catch(() => {});

        const choice = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
            max: 1,
            time: 10000
        });
        try {
            const content = choice.array()[0].content.toLowerCase();
            if (content.includes('heads')) {
                await util.addCD(message.author.id, this.name, {
                    cd: 30000
                });

                if (coinFlip === heads) {
                    await util.updateDBUser(message.author.id, {
                        pocket: 1
                    });
                    return message.channel.send('It was heads! You have been awarded one coin!').catch(() => {});
                } else {
                    return message.channel.send('aw it was tails and you suck, sad day for you').catch(() => {});
                }
            } else if (content.includes('tails')) {
                await util.addCD(message.author.id, this.name, {
                    cd: 30000
                });

                if (coinFlip === tails) {
                    await util.updateDBUser(message.author.id, {
                        pocket: 1
                    });
                    return message.channel.send('It was tails! You have been awarded one coin!').catch(() => {});
                } else {
                    return message.channel.send('aw it was heads and you suck, sad day for you').catch(() => {});
                }
            } else {
                message.channel.send('You need to answer with heads or tails next time. Try the command again, stupid').catch(() => {});
            }
        } catch (e) {
            message.channel.send('I flipped the coin, but you didn\'t call it in time!').catch(() => {});
        }
        await util.addCD(message.author.id, this.name);

    },
};