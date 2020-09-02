module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args, client) {
        function pingPersonOnce() {
            if(user != null){
                message.channel.send('<@' + user + '> is the best');
            }
            else{
                message.channel.send('<@692612058860224543> is the best');
            }
        }

        var timer = parseInt(args[1]);
        for (var i = 1; i <= args[0]; i++) {
            user = client.users.fetch("name", args[2]).id;
            var messageTimer = timer * i
            setTimeout(pingPersonOnce, messageTimer);
        }
    },
};