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
        if (message.member.roles.cache.some(role => role.name === 'Admin' || role.name === 'admin' || role.name === 'Admins' || role.name === 'admins' || role.name === 'cat' || role.name === 'Best')) {
            var timer = parseInt(args[1]);
            if(isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2])){
                message.channel.send('Invaild arguments, all arguments must be a number');
            }
            if(timer < 1000){
                message.channel.send('Maximum message send speed is 1 per second');
                timer = 1000;
            }
            else if(timer > 86400000){
                message.channel.send('Minimum message send speed is 1 per day');
                timer = 86400000;
            }
            if(args[0] > 100){
                message.channel.send('Maximum messages able to be sent is 100');
                args[0] = '100';
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