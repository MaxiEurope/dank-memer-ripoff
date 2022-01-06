/** useless command */
module.exports = {
    name: 'eval',
    async execute(memer, message, args) {

        if (message.author.id !== memer.config.owner) return;

        try {
            const res = await eval(args.join(' '));
            return message.channel.send(`\`\`\`js\n${res}\`\`\``);
        } catch (error) {
            return message.channel.send(`\`\`\`js\n${error}\`\`\``);
        }

    },
};