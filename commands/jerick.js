module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        var variableName, i;
        function pingPerson() {
                variableName = setInterval(pingPersonOnce, args[1]);
        }
        function pingPersonOnce() {
            message.channel.send('<@692612058860224543> is the best');
            clearInterval(variableName);
        }
        for(i = 0; i < args[0]; i++){
            pingPerson();
        }
    },
};