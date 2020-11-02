const mong = require('mongoose');

const models = {
    cd: mong.model('cd', mong.Schema({
        userID: String,
        cmd: String,
        cooldown: Number,
        defaultCD: Number,
        message: String
    })),
    user: mong.model('user', mong.Schema({
        userID: String,
        bank: Number,
        pocket: Number,
        pls: Number,
        streak: {
            streak: Number,
            time: Number
        },
        donor: Boolean
    }))
};

module.exports = models;