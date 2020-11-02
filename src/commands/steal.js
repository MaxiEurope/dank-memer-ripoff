const util = require('../data/util.js');

module.exports = {
    name: 'steal',
    aliases: ['rob', 'ripoff'],
    async execute(memer, message, args) {

        const user = util.getUser(memer, args[0]);
        const min = 500;

        if (!user) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('try running the command again, but this time actually mention someone to steal from').catch(() => {});
        }
        if (user.id === message.author.id) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send('hey stupid, seems pretty dumb to steal from urself').catch(() => {});
        }

        const me = await util.getDBUser(message.author.id);
        const victim = await util.getDBUser(user.id);

        if (me.pocket < min) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send(`You need at least ${min} coins to try and rob someone.`).catch(() => {});
        }
        if (victim.pocket < min) {
            await util.addCD(message.author.id, this.name);
            return message.channel.send(`The victim doesn't have at least ${min} coins, not worth it man`).catch(() => {});
        }

        await util.addCD(message.author.id, this.name, {
            cd: 300000,
            msg: 'Woahhh there, you need some time to plan your next hit. Wait'
        });

        const stealingOdds = util.randomNum(1, 100);

        if (stealingOdds <= 60) { // fail section
            let punish;
            if ((me.pocket * 0.05) < 500) {
                punish = 500;
            } else {
                punish = me.pocket * 0.05;
            }
            await util.updateDBUser(message.author.id, {
                pocket: Math.round(punish) * (-1)
            });
            await util.updateDBUser(user.id, {
                pocket: Math.round(punish)
            });
            message.channel.send(`You were caught! You paid the person you stole from **${Math.round(punish)}** coins.`).catch(() => {});
        } else if (stealingOdds > 60 && stealingOdds <= 80) { // 30% payout
            let worth = Math.round(victim.pocket * 0.3);
            await util.updateDBUser(message.author.id, {
                pocket: worth
            });
            await util.updateDBUser(user.id, {
                pocket: worth * (-1)
            });
            await util.msgUser(memer, message, user.id, `**${message.author.tag}** has stolen **${worth.toLocaleString()}** coins from you!`);
            message.channel.send(`You managed to steal a small amount before leaving! 💸\nYour payout was **${worth.toLocaleString()}** coins.`).catch(() => {});
        } else if (stealingOdds > 80 && stealingOdds <= 90) { // 50% payout
            let worth = Math.round(victim.pocket * 0.5);
            await util.updateDBUser(message.author.id, {
                pocket: worth
            });
            await util.updateDBUser(user.id, {
                pocket: worth * (-1)
            });
            await util.msgUser(memer, message, user.id, `**${message.author.tag}** has stolen **${worth.toLocaleString()}** coins from you!`);
            message.channel.send(`You managed to steal a large amount before leaving! 💰\nYour payout was **${worth.toLocaleString()}** coins.`).catch(() => {});
        } else { // full theft
            let worth = Math.round(victim.pocket);
            await util.updateDBUser(message.author.id, {
                pocket: worth
            });
            await util.updateDBUser(user.id, {
                pocket: worth * (-1)
            });
            await util.msgUser(memer, message, user.id, `**${message.author.tag}** has stolen **${worth.toLocaleString()}** coins from you!`);
            message.channel.send(`You managed to steal a TON before leaving! 🤑\nYour payout was **${worth.toLocaleString()}** coins.`).catch(() => {});
        }

    },
};