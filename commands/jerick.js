module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        function pingPerson() {
                setInterval(pingPersonOnce, args[1]);
        }
        function pingPersonOnce() {
            message.channel.send('<@692612058860224543> is the best');
        }
        setInterval(pingPerson, args[0]);
    },
};