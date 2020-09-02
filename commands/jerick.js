module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        setInterval(botStatus, 1200);
        function botStatus() {
           message.channel.send('<@692612058860224543> is the best');
        }
    },
};