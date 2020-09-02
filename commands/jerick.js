module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args, client) {
        function pingPersonOnce() {
            console.log(args[2])
            if(args[2] != undefined){
                message.channel.send('<@' + args[2] + '> is the best');
            }
            else{
                message.channel.send('<@' + message.author.id + '> is the best');
            }
        }

        var timer = parseInt(args[1]);
        for (var i = 1; i <= args[0]; i++) {
            var messageTimer = timer * i
            setTimeout(pingPersonOnce, messageTimer);
        }
    },
};