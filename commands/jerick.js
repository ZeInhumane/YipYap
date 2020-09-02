module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        var variableName;
        function pingPerson() {
                variableName = setInterval(pingPersonOnce, args[1]);
        }
        function pingPersonOnce() {
            message.channel.send('<@692612058860224543> is the best');
            clearInterval(variableName);
        }
        setInterval(pingPerson, args[0]);
    },
};