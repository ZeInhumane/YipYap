const express = require('express');
const Topgg = require('@top-gg/sdk');
const fetch = require('node-fetch');
const handleVote = require('./src/handlers/vote.js');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

const webhook = new Topgg.Webhook(process.env.webhookAuth);

app.post('/dblwebhook', webhook.listener(vote => {
    console.log('User with id', vote.user, 'has voted!');
    const value = JSON.stringify({
        embeds: [
            {
                title: "Vote received!",
                description: `${vote.user} just voted`,
                color: "16757575",
            },
        ],
    });
    fetch("https://discord.com/api/webhooks/945970353002385418/gjiHIF2X6vBYniJyOEv5Z2-eitZMZ-IEgsi7yiLJpeXbpGpA_yQzNvGq6PdqaDT_BJ-A", {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: value,
    }).catch(e => console.log('Error occurred: ', e));

    handleVote(vote.user);
}));

app.listen(process.env.PORT || 80);
console.log('App has restarted');