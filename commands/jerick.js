module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        botStatus();
        function botStatus() {
           message.channel.send('<@272202473827991557> is the best');
        }
    },
};