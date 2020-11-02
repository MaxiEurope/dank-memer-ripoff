const util = require('../data/util.js');

module.exports = {
    name: 'gamble',
    aliases: ['bet'],
    async execute(memer, message, args) {

        const {
            total
        } = await util.calcMulti(message);
        const {
            pocket
        } = await util.getDBUser(message.author.id);

        let bet = args[0];
        if (!bet) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('You need to bet something.').catch(() => {});
        }
        if (isNaN(bet)) {
            if (bet === 'all') {
                bet = pocket;
            } else if (bet === 'half') {
                bet = Math.round(pocket / 2);
            } else {
                await util.addCD(message.author.id, this.name);
                return message.channel.send('You have to bet actual coins, dont try to break me.').catch(() => {});
            }
        }
        if (bet < 1 || !Number.isInteger(Number(bet))) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('Needs to be a whole number greater than 0').catch(() => {});
        }
        bet = Number(bet);
        if (pocket === 0) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('You have no coins.').catch(() => {});
        }
        if (bet > pocket) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send(`You only have ${pocket.toLocaleString()} coins, dont bluff me.`).catch(() => {});
        }

        await util.addCD(message.author.id, this.name, {
            cd: 50000,
            msg: 'If I let you bet whenever you wanted, you\'d be a lot more poor. Wait'
        });

        let random = Math.random();

        if (random > 0.95) {
            let winAmount = Math.random() + 0.8;
            let random = Math.round(Math.random());
            winAmount = winAmount + random;
            let winnings = Math.round(bet * winAmount);
            winnings = winnings + Math.round(winnings * (total / 100));
            if (winnings === bet) {
                return message.channel.send('You broke even. This means you\'re lucky I think?').catch(() => {});
            }

            await util.updateDBUser(message.author.id, {
                pocket: winnings
            });
            return message.channel.send(`You won **${winnings.toLocaleString()}** coins. \n**Multiplier**: ${total}% | **Percent of bet won**: ${winnings.toFixed(2) * 100}%`).catch(() => {});
        } else if (random > 0.65) {
            let winAmount = Math.random() + 0.4;
            let winnings = Math.round(bet * winAmount);
            winnings = winnings + Math.round(winnings * (total / 100));
            if (winnings === bet) {
                return message.channel.send('You broke even. This means you\'re lucky I think?').catch(() => {});
            }

            await util.updateDBUser(message.author.id, {
                pocket: winnings
            });
            return message.channel.send(`You won **${winnings.toLocaleString()}** coins. \n**Multiplier**: ${total}% | **Percent of bet won**: ${winAmount.toFixed(2) * 100}%`).catch(() => {});
        } else {
            await util.updateDBUser(message.author.id, {
                pocket: bet * (-1)
            });
            return message.channel.send(`You lost **${Number(bet).toLocaleString()}** coins.`).catch(() => {});
        }

    },
};