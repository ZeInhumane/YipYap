module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args, client) {
        function pingPersonOnce() {
            console.log(args[2])
            if (args[2] != undefined) {
                message.channel.send('<@' + args[2] + '> is the best');
            }
            else {
                message.channel.send('<@' + message.author.id + '> is the best');
            }
        }
        if (message.author.roles.has('675926490059112448' || '692375956471676948')) {
            var timer = parseInt(args[1]);
            if(timer < 1000){
                message.channel.send('Minimum message send speed is 1 per second');
                timer = 1000;
            }
            if(args[0] > 100){
                message.channel.send('Maximum messages able to be sent is 100');
                arg[0] = '100';
            }
            for (var i = 1; i <= parseInt(args[0]); i++) {
                var messageTimer = timer * i
                setTimeout(pingPersonOnce, messageTimer);
            }
        }
        else {
            message.channel.send('You need to be an admin in order to use this command');
        }
    },
};