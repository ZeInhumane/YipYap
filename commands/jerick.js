module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        args[1] = parseInt(args[1]);
        function pingPerson(i) {
            args[1] *= i
            setTimeout(pingPersonOnce, parseInt(args[1]));
            console.log(args[1]);
        }
        function pingPersonOnce() {
            message.channel.send('<@692612058860224543> is the best');
        }
        for (var i = 1; i <= args[0]; i++) {
            pingPerson(i);
        }
    },
};