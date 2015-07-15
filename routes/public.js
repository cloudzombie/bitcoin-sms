'use strict';

var app = require('../index'),
    navLinks = require('../lib/base-data').navLinks,

    renderData = {
        costPerQuery: app.locals.costPerQuery,
        siteTitle: app.locals.siteTitle
    };


/**
 * Helper to configure the renderData according to whether or not a user is logged in
 * NOTE: Right now, the "user" object is being generated and maintained by stormpath.
 */
function handleUserState (req) {
    renderData.navLinks = req.user ? navLinks.signedIn : navLinks.signedOut;
}



app.get('/', function (req, res) {
    handleUserState(req);
    //console.log(renderData);
    res.render('main', renderData);
});

app.get('/pricing', function (req, res) {
    handleUserState(req);
    res.render('pricing', renderData);
});

app.get('/docs', function (req, res) {
    handleUserState(req);
    res.render('docs', renderData);
});

module.exports = app;
