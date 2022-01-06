const config = require('./config.json');
const models = require('./models.js');

const util = {
    /** command cooldown */
    addCD: async function (id, cmd, {
        cd = 2000,
        msg = ''
    } = {}) {
        return await new models.cd({
            userID: id,
            cmd: cmd,
            cooldown: Date.now() + cd,
            defaultCD: cd,
            message: msg
        }).save();
    },
    getCD: async function (id, cmd) {
        const res = await models.cd.findOne({
            userID: id,
            cmd: cmd
        });
        return {
            cooldown: res.cooldown,
            defaultCD: res.defaultCD,
            message: res.message
        };
    },
    hasCD: async function (id, cmd) {
        return await models.cd.findOne({
            userID: id,
            cmd: cmd
        }) !== null;
    },
    removeCD: async function (id, cmd) {
        return await models.cd.findOneAndDelete({
            userID: id,
            cmd: cmd
        });
    },
    delCDs: async function () {
        return await models.cd.deleteMany({
            cooldown: {
                $lte: Date.now()
            }
        });
    },
    /** regular things */
    isNum: function (num) {
        return !isNaN(num) && parseInt(Number(num)) == num && !isNaN(parseInt(num, 10));
    },
    parseTime: function (time) {
        const methods = [{
                name: 'd',
                count: 86400
            },
            {
                name: 'h',
                count: 3600
            },
            {
                name: 'm',
                count: 60
            },
            {
                name: 's',
                count: 1
            }
        ];

        const timeStr = [Math.floor(time / methods[0].count).toString() + methods[0].name];
        for (let i = 0; i < 3; i++) {
            timeStr.push(Math.floor(time % methods[i].count / methods[i + 1].count).toString() + methods[i + 1].name);
        }

        return timeStr.filter(g => !g.startsWith('0')).join(', ');
    },
    randomColor: function () {
        return Math.floor(Math.random() * 0xFFFFFF);
    },
    randomNum: function (min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    wait: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    /** discord methods */
    calcMulti: async function (message) {
        const guildMemer = message.guild.members.cache.get(message.author.id);
        const {
            donor,
            streak,
            pls
        } = await this.getDBUser(message.author.id);
        const date = new Date(message.createdTimestamp);
        let day;
        let time;
        let text = '';
        let total = 0;
        let unlocked = 0;
        /** emojis */
        if (message.guild.emojis.cache.size >= 69) {
            if (message.guild.emojis.cache.size === 69) {
                total += 0.5;
                text += '69+ server emojis\n';
                unlocked += 1;
            }
            total += 0.5;
            text += '69 server emojis\n';
            unlocked += 1;
        }
        /** channel */
        if (message.channel.name.toLowerCase().includes('dank-memer')) {
            total += 0.5;
            text += 'Dank Memer channel\n';
            unlocked += 1;
        }
        /** upvoted x2 (can't really check lol) */
        total += 1;
        text += '[Upvoted](https://top.gg/bot/memes/vote)\n';
        unlocked += 1;
        /** check donor */
        if (donor === true) {
            total += 10;
            text += '[Donor](https://www.patreon.com/dankmemerbot)\n';
            unlocked += 1;
        }
        /** streak higher than 14 */
        if (streak.streak >= 15) {
            total += 0.5;
            text += '15+ day streak\n';
            unlocked += 1;
        }
        /** command usage */
        if (pls >= 50) {
            total += 1;
            text += '50+ commands used\n';
            unlocked += 1;
        } else if (pls >= 100) {
            total += 2;
            text += '100+ commands used\n';
            unlocked += 1;
        } else if (pls >= 150) {
            total += 3;
            text += '150+ commands used\n';
            unlocked += 1;
        } else if (pls >= 250) {
            total += 4;
            text += '250+ commands used\n';
            unlocked += 1;
        } else if (pls >= 500) {
            total += 5;
            text += '500+ commands used\n';
            unlocked += 1;
        }
        /** username */
        if (guildMemer.user.username.toLowerCase().includes('dank')) {
            total += 1;
            text += 'Username is dank\n';
            unlocked += 1;
        }
        /** nickname */
        if (guildMemer.nickname && guildMemer.nickname.toLowerCase().includes('dank')) {
            total += 1;
            text += 'Nickname is dank\n';
            unlocked += 1;
        }
        /** support server */
        if (message.guild.id === config.support) {
            total += 1;
            text += 'In support server\n';
            unlocked += 1;
        }
        /** 4:20 */
        if (date.getMinutes() === 20 && date.getHours() === 4) {
            total += 4.2;
            text += '4:20\n';
            unlocked += 1;
            time = true;
        }
        if (date.getDay() === 20 && date.getMonth() === 4) {
            total += 4.2;
            text += '4/20\n';
            unlocked += 1;
            day = true;
        }
        if (time && day) {
            total += 420;
            text += '4/20 + 4:20\n';
            unlocked += 1;
        }
        total += 111;
        text += 'Retard bonus <:head:733010536278655120>';
        unlocked += 1;
        
        return {
            total: total,
            text: text,
            unlocked: unlocked
        };
    },
    getUser: function (memer, arg = '') {
        if (arg.match(/<@!?([0-9]*)>/)) {
            arg = arg.match(/<@!?([0-9]*)>/)[1];
        }
        let user;
        try {
            user = memer.users.cache.get(arg);
        } catch (e) {
            user = false;
        }
        return user;
    },
    msgUser: async function (memer, message, arg, msg) {
        try {
            const user = await this.getUser(memer, arg);
            await user.send(msg);
        } catch (err) {
            await message.channel.send(`<@${arg}>, ${msg}`).catch(() => {});
        }
        return;
    },
    /** db related methods */
    getDBUser: async function (id, {
        create = true
    } = {}) {
        const res = await models.user.findOne({
            userID: id
        });
        if (res === null) {
            if (create === true) {
                await this.setDBUser(id);
            }
            return {
                bank: 0,
                pocket: 0,
                pls: 0,
                streak: {
                    streak: 0,
                    time: 0
                },
                donor: false
            };
        } else {
            return {
                bank: res.bank,
                pocket: res.pocket,
                pls: res.pls,
                streak: {
                    streak: res.streak.streak,
                    time: res.streak.time
                },
                donor: res.donor
            };
        }
    },
    updateDBUser: async function (id, {
        bank = 0,
        pocket = 0,
        pls = 0,
        streak = {
            streak: 0,
            time: 0
        },
        donor
    } = {}) {
        const res = await this.getDBUser(id);
        const updated = await models.user.findOneAndUpdate({
            userID: id
        }, {
            bank: res.bank + bank,
            pocket: res.pocket + pocket,
            pls: res.pls + pls,
            streak: {
                streak: res.streak.streak + streak.streak,
                time: res.streak.time + streak.time
            },
            donor: (typeof donor !== 'boolean') ? res.donor : donor
        }, {
            new: true
        });
        return {
            bank: updated.bank,
            pocket: updated.pocket,
            pls: updated.pls,
            streak: {
                streak: updated.streak.streak,
                time: updated.streak.time
            },
            donor: updated.donor
        };
    },
    setDBUser: async function (id) {
        return await new models.user({
            userID: id,
            bank: 0,
            pocket: 0,
            pls: 0,
            streak: {
                streak: 0,
                time: 0
            },
            donor: true /** change this */
        }).save();
    }
};

module.exports = util;