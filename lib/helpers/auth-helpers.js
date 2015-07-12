/**
 * Helper functions for handling user auth and registration
 */

var async = require('async'),
    api = {};


/**
 * Initialize a user by creating an API key for them automatically,
 * as well as setting their account balance and total queries to 0.
 */
api.onStormpathRegistration = function onStormpathRegistration(account, req, res, next) {
    async.parallel([
        function setUserDefaults (cb) {
            account.customData.balance = 0;
            account.customData.totalQueries = 0;
            account.customData.save(function (err) {
                if (err) { return cb(err); }
                cb();
            });
        },
        function createUserApiKey (cb) {
            account.createApiKey(function (err, key) {
                if (err) { return cb(err); }
                cb();
            });
        }
    ], function (err) {
        if (err) { return next(err); }
        next();
    });
};


module.exports = api;
