module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        var i;
        function pingPerson() {
                setTimeout(pingPersonOnce, args[1]);
        }
        function pingPersonOnce() {
            message.channel.send('<@692612058860224543> is the best');
        }
        for(i = 0; i < args[0]; i++){
            pingPerson();
        }
    },
};