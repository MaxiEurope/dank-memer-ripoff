const config = require('../data/config.json');
const discord = require('discord.js-light');
const util = require('../data/util.js');

module.exports = {
    name: 'bank',
    async execute(memer, message, args) {

        await util.addCD(message.author.id, this.name);

        const {
            bank,
            pocket,
            pls
        } = await util.getDBUser(message.author.id);
        let amount = args[1];
        if (args[0]) {
            switch (args[0].toLowerCase()) {
                case 'dep':
                case 'deposit':
                    if (isNaN(amount)) {
                        if (['all', 'max'].some(e => amount === e)) {
                            amount = Math.round((500 + ((pls * 23 / 100) * 150) - bank));
                        }
                    }
                    amount = Number(amount);
                    if (amount && amount <= pocket) {
                        if (amount + bank > Math.round(500 + ((pls * 23 / 100) * 150))) {
                            return message.channel.send(`You can only hold ${Math.round(500 + ((pls*23 / 100) * 150)).toLocaleString()} coins in your bank right now. To hold more, use the bot more.`).catch(() => {});
                        }
                        if (amount < 1 || !Number.isInteger(Number(amount))) {
                            return message.channel.send('Needs to be a whole number greater than 0').catch(() => {});
                        }
                        await util.updateDBUser(message.author.id, {
                            bank: amount,
                            pocket: amount * (-1)
                        });
                        message.channel.send(`${amount.toLocaleString()} coin${amount === 1 ? '' : 's'} deposited.`).catch(() => {});
                    } else {
                        message.channel.send(`Your second argument should be a number and no more than what you have in your pocket (${pocket.toLocaleString()})`).catch(() => {});
                    }
                    break;
                case 'with':
                case 'withdraw':
                    if (isNaN(amount)) {
                        if (['all', 'max'].some(e => amount === e)) {
                            amount = bank;
                        }
                    }
                    amount = Number(amount);
                    if (amount && amount <= bank) {
                        if (amount < 1 || !Number.isInteger(Number(amount))) {
                            return message.channel.send('Needs to be a whole number greater than 0').catch(() => {});
                        }
                        await util.updateDBUser(message.author.id, {
                            bank: amount * (-1),
                            pocket: amount
                        });
                        message.channel.send(`${amount.toLocaleString()} coin${amount === 1 ? '' : 's'} withdrawn.`).catch(() => {});
                    } else {
                        message.channel.send(`Your second argument should be a number and no more than what you have in your bank (${bank.toLocaleString()})`).catch(() => {});
                    }
                    break;
                default:
                    return message.channel.send('Hm, thats not how this command works, first argument should be deposit or withdraw').catch(() => {});
            }
        } else {
            const e = new discord.MessageEmbed()
                .setTitle(`${message.author.username}'s account:`)
                .setDescription(`**Current Balance**: ${bank.toLocaleString()}/${Math.round(500 + ((pls *23/ 100) * 150)).toLocaleString()}\nYou can deposit coins with \`${config.prefixes[0]} bank deposit #\`\nYou can withdraw coins with \`${config.prefixes[0]} bank withdraw #\``)
                .setFooter('You can earn more vault space by using the bot more often')
                .setColor(util.randomColor());
            message.channel.send(e).catch(() => {});
        }

    },
};