'use strict';

var app = require('../index'),
    bodyParser = require('body-parser'),
    stormpath = require('express-stormpath'),
    stripe = require('stripe')(process.env.STRIPE__SECRET_KEY),
    navLinks = require('../lib/base-data').navLinks,

    renderData = {
        costPerQuery: app.locals.costPerQuery,
        siteTitle: app.locals.siteTitle,
        stripePublishableKey: process.env.STRIPE__PUBLIC_KEY
    };


/**
 * Helper to modify the renderData according to the request information
 * NOTE: Right now, the "user" object is being generated and maintained by stormpath.
 */
function prepareRenderData(req) {
    renderData.navLinks = navLinks.signedIn;  // There's only one possibility if we got here

    if (!req.user.customData.totalQueries) {
        req.user.customData.totalQueries = 0;  // Make sure this is set to number value of 0
    }
    renderData.user = req.user;
}


app.use(bodyParser.urlencoded({extended: true}));  // allows access to form data directly via req.body
app.use('/dashboard', stormpath.loginRequired);

app.get('/dashboard', function (req, res) {
    prepareRenderData(req);
    res.render('dashboard', renderData);
});


/**
 * Respond to our manual form submission after the client
 * has fulfilled a payment request to Stripe
 */
app.post('/dashboard/charge', function (req, res, next) {

    // Stripe payment was sent by the client. Update state here
    req.user.customData.balance += parseInt(req.body.addedFunds);
    req.user.customData.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/dashboard');
    });

    // create the charge object

    //var charge = {
    //    amount: 2000,
    //    currency: 'usd',
    //    source: req.body.stripeToken,
    //    description: 'One time deposit for ' + req.user.email + '.'
    //};
    //
    //stripe.charges.create(
    //    charge,
    //    function (err, charge) {
    //        if (err) {
    //            return next(err);
    //        }
    //        req.user.customData.balance += charge.amount;
    //        req.user.customData.save(function (err) {
    //            if (err) {
    //                return next(err);
    //            }
    //            res.redirect('/dashboard');
    //        });
    //    });
});


module.exports = app;
