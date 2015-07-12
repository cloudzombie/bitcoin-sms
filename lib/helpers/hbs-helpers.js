var api = module.exports = {};

/**
 * Convert a whole cents value to '$x.xx'
 */
api.centsToCurrency = function centsToCurrency (cents) {

    var dollars = 0;
    if ( typeof cents === 'number' || !!(parseFloat(cents)) ) {
        dollars = parseFloat(cents) / 100;
    }
    return '$' + dollars.toFixed(2);
};

/**
 * Convert a whole dollar value to '$x.xx'
 */
api.dollarsToCurrency = function currency (dollars) {
    var val;

    if ( typeof dollars === 'number' || !!(parseFloat(dollars)) ) {
        val = parseFloat(dollars);
    }
    return '$' + val.toFixed(2);
};
