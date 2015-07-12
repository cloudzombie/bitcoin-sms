'use strict';

var app = require('../index'),
    constants = require('../lib/constants/constants'),
    bodyParser = require('body-parser'),
    request = require('request'),
    twilio = require('twilio')(process.env.TWILIO__ACCOUNT_SID, process.env.TWILIO__AUTH_TOKEN),
    stormpath = require('express-stormpath'),
    AuthHelpers = require('../lib/helpers/auth-helpers'),



    BTC_EXCHANGE_RATE,
    BTC_UPDATE_INTERVAL = 60000,
    COST_PER_QUERY = parseInt(constants.COST_PER_QUERY);


app.use(bodyParser.json());
app.use('/api', stormpath.apiAuthenticationRequired);



app.post('api/message', function (req, res) {

    // Each incoming request must supply a phone number so we know who to SMS
    if (!req.body || !req.body.phoneNumber) {
        return res.status(400).json({error: 'phoneNumber is required.'});

    } else if (!BTC_EXCHANGE_RATE) {
        return res.status(500).json({
            error: 'We\'re having trouble getting the' +
            'current exchange rates at the moment. Please try again soon.'
        });

    // The user must have enough money to pay for the request!
    } else if (req.user.customData.balance < COST_PER_QUERY) {
        return res.status(402).json({
            error: 'You currently don\'t have enough funds in your account' +
            'to cover the current payment of ' + COST_PER_QUERY +
            'Please make a deposit before attempting a request.'
        });
    }

    var bitCoinMessage = '1 Bitcoin is currently worth $' + BTC_EXCHANGE_RATE +
        'USD.';

    twilio.sendMessage({
        to: req.body.phoneNumber,
        from: process.env.TWILIO__PHONE_NUMBER,
        body: message
    }, function (err, resp) {
        if (err) {
            return res.status(500).json({
                error: 'We couldn\'t send the SMS ' +
                'message at this time. Please try again soon. You have not been ' +
                'charged for this transaction.'
            });
        }
        req.user.customData.balance -= COST_PER_QUERY;
        req.user.customData.totalQueries += 1;
        req.user.customData.save();

        res.json({
            phoneNumber: req.body.phoneNumber,
            message: bitCoinMessage,
            cost: COST_PER_QUERY
        });
    });
});

// Main functionality
function getExchangeRates() {

    request(constants.api.bitcoin.price, function (err, resp, body) {

        if (err || resp.statusCode !== 200) {
            console.log('Failed to retrieve BTC exchange rates.');
            return;
        }

        try {
            var data = JSON.parse(body);
            BTC_EXCHANGE_RATE = data.USD['24h'];
            console.log('Updated Bitcoin Exchange Rate: ' + BTC_EXCHANGE_RATE);
        }
        catch (err) {
            console.log('Failed to parse Bitcoin exchange rates: ' + err);
        }
    });
}

getExchangeRates();
setTimeout(getExchangeRates, BTC_UPDATE_INTERVAL);
module.exports = app;


