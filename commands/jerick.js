module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        function pingPerson() {
            for (i < 0; i < args[0]; i++) {
                setInterval(pingPersonOnce, args[1]);
                function pingPersonOnce() {
                    message.channel.send('<@692612058860224543> is the best');
                    clearInterval()
                }
            }
        }
        pingPerson();
    },
};