'use strict';

// Node modules
var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    path = require('path'),
    logger = require('express-logger'),
    methodOverride = require('express-method-override'),
    stormpath = require('express-stormpath'),


// local modules
    secrets = require('./lib/secrets/secrets'),
    constants = require('./lib/constants/constants'),
    HbsHelpers = require('./lib/helpers/hbs-helpers'),
    AuthHelpers = require('./lib/helpers/auth-helpers'),


// Globals
    app = module.exports = express(),
    port = process.env.PORT || constants.port,

    hbs = exphbs.create({
        defaultLayout: 'application',
        helpers: HbsHelpers,
        extname: '.hbs',

        // Uses multiple partials dirs, templates in "shared/templates/" are shared
        // with the client-side of the app (see below).
        partialsDir: [
            'shared/templates',
            'views/partials'
        ]
    });


app.set('port', process.env.PORT || port);
app.engine('.hbs', hbs.engine);   // use .hbs extension and set the callback to our hbs intance's `engine` function
app.set('view engine', '.hbs');


app.locals.costPerQuery = parseInt(constants.COST_PER_QUERY);
app.locals.siteTitle = 'BITCOIN SMS';
app.locals.stripePublishableKey = process.env.STRIPE__PUBLIC_KEY;


// Middleware to expose the app's shared templates to the client-side of the app
// for pages which need them.
function exposeTemplate(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.getTemplates('shared/templates', {
        cache: app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegExp = new RegExp(hbs.extname + '$');


        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name: name.replace(extRegExp, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }
        setImmediate(next);
    })
        .catch(next);
}

////////////////////// Configure Middleware  ////////////////////

app.use(logger({ path: 'logs/log.txt' }));      // log every request to the console

app.use(express.static('public', {
    index: false,
    redirect: false
}));

// The Stormpath middleware must always be the last initialized
// middleware, but must come before any custom route code.
app.use(stormpath.init(app, {
    apiKeyFile: './lib/secrets/stormpath.properties',
    application: secrets.STORMPATH__REST_URL,
    enableAccountVerification: true,    // when a user signs up, we'll email them a link to click on to verify their address
    expandApiKeys: true,                // Stormpath will automatically pull down a user’s API key information, caching it locally to speed up API requests.
    expandCustomData: true,             // Stormpath will automatically pull down a the customData JSON object that we store for each user, cahing it locally for quick access
    redirectUrl: '/dashboard',          // redirect destination after a user logs in
    secretKey: 'expelliarmus',
    postRegistrationHandler: AuthHelpers.onStormpathRegistration   // function to run after a user signs up
}));


require('./routes/public');
require('./routes/private');
require('./routes/api');

app.listen(port);
