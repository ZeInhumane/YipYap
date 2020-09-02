module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        var variableName;
        function pingPerson() {
            var i;
            for (i = 0; i < args[0]; i++) {
                variableName = setInterval(pingPersonOnce, args[1]);
            }
        }
        function pingPersonOnce() {
            message.channel.send('<@692612058860224543> is the best');
            clearInterval(variableName);
        }
        pingPerson();
    },
};