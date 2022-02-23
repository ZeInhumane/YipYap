const express = require('express');
const Topgg = require('@top-gg/sdk');
const fetch = require('node-fetch');

const app = express();
const webhook = new Topgg.Webhook(process.env.token);
module.exports = () => {
    app.post('/vote', webhook.listener(vote => { // ending url
        console.log("User with id - " + vote.user + " just voted!");
        let value = JSON.stringify({
            embeds: [
                {
                    title: "Thanks for voting",
                    description: '<@${vote.user}> Just voted for Bot!',
                    color: "8388736" //Hex -> Decimal
                }
            ]
        })
        fetch("WEBHOOK", {
            methon: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: value
        }).catch(e => console.log('Error accured while posting webhook : ' + e));
    }));
    app.listen(process.env.PORT);
    console.log("Vote log is ready!");
};
