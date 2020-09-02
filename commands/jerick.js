module.exports = {
    name: "jerick",
    description: "Pings Jerick",
    execute(message, args) {
        var variableName;
        function pingPerson() {
                setInterval(pingPersonOnce, args[1]);
        }
        function pingPersonOnce() {
            message.channel.send('<@692612058860224543> is the best');
        }
        function timingThing(){
            clearInterval(variableName);
        }
        variableName = setInterval(pingPerson, args[0]);
        setInterval(timingThing, args[0]);
    },
};