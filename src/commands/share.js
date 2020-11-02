const util = require('../data/util.js');

module.exports = {
    name: 'share',
    aliases: ['give'],
    async execute(memer, message, args) {

        const user = util.getUser(memer, args[0]);

        if (!user) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('who r u giving coins to, dumb').catch(() => {});
        }

        let given = args[1];

        if (!given || !Number.isInteger(Number(given)) || isNaN(given)) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('you have to to actually share a number, dummy. Not ur dumb feelings').catch(() => {});
        }
        given = Number(given);

        const _giverCoins = await util.getDBUser(message.author.id);

        if (given > _giverCoins.pocket) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send(`You only have ${_giverCoins.pocket.toLocaleString()} coins, you can't share that many`).catch(() => {});
        }
        if (given < 1) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('You can\'t share 0 coins you dumb').catch(() => {});
        }

        await util.addCD(message.author.id, this.name, {
            cd: 1200000
        });

        const takerCoins = await util.updateDBUser(user.id, {
            pocket: given
        });
        const giverCoins = await util.updateDBUser(message.author.id, {
            pocket: given * (-1)
        });

        message.channel.send(`You gave ${user.username} ${given.toLocaleString()} coins, now you have ${(giverCoins.pocket).toLocaleString()} and they've got ${(takerCoins.pocket).toLocaleString()}`).catch(() => {});

    },
};