const express = require('express');
const Topgg = require('@top-gg/sdk');
const fetch = require('node-fetch');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

const webhook = new Topgg.Webhook(process.env.webhookAuth);

app.post('/dblwebhook', webhook.listener(vote => {
    console.log('User with id', vote.user.id, 'has voted!');
    const value = JSON.stringify({
        embeds: [
            {
                title: "Vote received!",
                description: `${vote.user} just voted`,
                color: "ffb347",
            },
        ],
    });
    fetch("https://discord.com/api/webhooks/945965926937948171/hbL_F42XWFpD2bzvgkK5_FeYzrmtsV7AJparoVrIUl_cau0bRKA3_EGsMzpJT8DK6ADE", {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: value,
    }).catch(e => console.log('Error occurred: ', e));
}));

app.listen(process.env.PORT || 80);
console.log('App has restarted');
// https://yipyapbot.herokuapp.com/