module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args, client) {
        function pingPersonOnce() {
            console.log(arg[2])
            if(arg[2] != undefined){
                message.channel.send('<@' + arg[2] + '> is the best');
            }
            else{
                message.channel.send('<@692612058860224543> is the best');
            }
        }

        var timer = parseInt(args[1]);
        for (var i = 1; i <= args[0]; i++) {
            var messageTimer = timer * i
            setTimeout(pingPersonOnce, messageTimer);
        }
    },
};